import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// In-memory rate limiter (5 requests per 10 minutes per IP)
const submissionRateLimit = new Map<string, { count: number; firstTimestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 5;

// Allowed bug types
const VALID_BUG_TYPES = [
  'Visual issue',
  'Broken button',
  'Upload issue',
  'Compression issue',
  'Conversion issue',
  'Mobile issue',
  'Performance issue',
  'Other'
];

function sanitize(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Strip brackets
    .trim()
    .slice(0, 5000); // Max payload length
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const now = Date.now();

    // 1. Rate Limiting Check
    const rateData = submissionRateLimit.get(ip);
    if (rateData) {
      if (now - rateData.firstTimestamp < RATE_LIMIT_WINDOW_MS) {
        if (rateData.count >= MAX_SUBMISSIONS_PER_WINDOW) {
          return NextResponse.json(
            { error: 'Too many submissions from your network. Please wait a few minutes before submitting another report.' },
            { status: 429 }
          );
        }
        rateData.count++;
      } else {
        submissionRateLimit.set(ip, { count: 1, firstTimestamp: now });
      }
    } else {
      submissionRateLimit.set(ip, { count: 1, firstTimestamp: now });
    }

    const body = await req.json();

    // 2. Honeypot check for bots
    if (body.website_hp && String(body.website_hp).trim().length > 0) {
      // Silently accept to avoid alerting bot
      return NextResponse.json({ success: true, message: 'Report received' }, { status: 200 });
    }

    // 3. Field Extraction & Sanitization
    const name = sanitize(body.name) || 'Anonymous Reporter';
    const email = sanitize(body.email);
    const tool = sanitize(body.tool);
    const bugType = sanitize(body.bugType);
    const description = sanitize(body.description);
    const stepsToReproduce = sanitize(body.stepsToReproduce);
    const expectedResult = sanitize(body.expectedResult);
    const actualResult = sanitize(body.actualResult);
    const browserInfo = sanitize(body.browserInfo) || req.headers.get('user-agent') || 'Unknown';
    const pageUrl = sanitize(body.pageUrl) || req.headers.get('referer') || 'Direct';
    const consent = Boolean(body.consent);

    // 4. Strict Validation
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'A valid email address is required so our engineers can reply with updates.' },
        { status: 400 }
      );
    }

    if (!description || description.length < 10) {
      return NextResponse.json(
        { error: 'Please provide a clear description of the bug (at least 10 characters).' },
        { status: 400 }
      );
    }

    if (!tool) {
      return NextResponse.json(
        { error: 'Please specify the tool or page where the issue occurred.' },
        { status: 400 }
      );
    }

    if (!VALID_BUG_TYPES.includes(bugType)) {
      return NextResponse.json(
        { error: 'Please select a valid bug category.' },
        { status: 400 }
      );
    }

    const reportId = `BUG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    // 5. Structure Email Content
    const emailSubject = `[FileForge AI Bug Report] [${bugType}] ${tool} (${reportId})`;
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0913; color: #f6f4ff; padding: 24px; border-radius: 12px; max-width: 650px; margin: 0 auto; border: 1px solid #322b4d;">
        <div style="border-bottom: 2px solid #a78bfa; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="color: #ff5fa2; margin: 0 0 6px 0; font-size: 20px;">FileForge AI — Incident Report</h2>
          <span style="font-family: monospace; font-size: 13px; color: #a78bfa;">ID: ${reportId}</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #a49cc4; width: 140px;">Reporter:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #f6f4ff;">${name} (&lt;${email}&gt;)</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #a49cc4;">Category:</td>
            <td style="padding: 6px 0; color: #ff5fa2; font-weight: bold;">${bugType}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #a49cc4;">Tool / Route:</td>
            <td style="padding: 6px 0; font-family: monospace;">${tool}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #a49cc4;">Page URL:</td>
            <td style="padding: 6px 0; font-family: monospace; word-break: break-all;">${pageUrl}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #a49cc4;">Device / UA:</td>
            <td style="padding: 6px 0; font-family: monospace; font-size: 12px;">${browserInfo}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #a49cc4;">Timestamp:</td>
            <td style="padding: 6px 0; font-family: monospace; font-size: 12px;">${timestamp}</td>
          </tr>
        </table>

        <div style="background-color: #171425; border: 1px solid #322b4d; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <h4 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">Description</h4>
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap; font-size: 14px;">${description}</p>
        </div>

        ${stepsToReproduce ? `
        <div style="background-color: #171425; border: 1px solid #322b4d; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <h4 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">Steps to Reproduce</h4>
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap; font-size: 14px;">${stepsToReproduce}</p>
        </div>` : ''}

        ${expectedResult || actualResult ? `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <div style="background-color: #171425; border: 1px solid #322b4d; border-radius: 8px; padding: 12px;">
            <h5 style="margin: 0 0 6px 0; color: #4ade80; font-size: 12px; text-transform: uppercase;">Expected Result</h5>
            <p style="margin: 0; font-size: 13px; line-height: 1.5;">${expectedResult || 'N/A'}</p>
          </div>
          <div style="background-color: #171425; border: 1px solid #322b4d; border-radius: 8px; padding: 12px;">
            <h5 style="margin: 0 0 6px 0; color: #f87171; font-size: 12px; text-transform: uppercase;">Actual Result</h5>
            <p style="margin: 0; font-size: 13px; line-height: 1.5;">${actualResult || 'N/A'}</p>
          </div>
        </div>` : ''}

        <div style="border-top: 1px solid #322b4d; padding-top: 12px; font-size: 12px; color: #a49cc4; text-align: center;">
          User Followup Consent: <strong>${consent ? 'YES — authorized to reply' : 'NO — report only'}</strong>
        </div>
      </div>
    `;

    // 6. Dispatch Email via Webform API or SMTP
    const webformKey =
      process.env.WEBFORM_API_KEY ||
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.WEBFORM_ACCESS_KEY ||
      process.env.WEB3FORMS_KEY;

    let webformDispatched = false;
    if (webformKey) {
      try {
        const webformRes = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            access_key: webformKey,
            subject: emailSubject,
            from_name: 'FileForge AI Bug Desk',
            name: `${name} (FileForge Reporter)`,
            email: email,
            category: bugType,
            tool: tool,
            report_id: reportId,
            page_url: pageUrl,
            browser_info: browserInfo,
            message: `FileForge AI Incident Report\n\nReport ID: ${reportId}\nCategory: ${bugType}\nTool: ${tool}\nReporter: ${name} <${email}>\nDevice: ${browserInfo}\nPage URL: ${pageUrl}\n\nDescription:\n${description}\n\nSteps to Reproduce:\n${stepsToReproduce || 'None provided'}\n\nExpected Result:\n${expectedResult || 'N/A'}\n\nActual Result:\n${actualResult || 'N/A'}\n\nFollow-up Consent: ${consent ? 'Yes' : 'No'}`
          })
        });
        const webformData = await webformRes.json();
        webformDispatched = true;
        console.log(`[Webform API] Incident report ${reportId} dispatched via webform:`, webformData.message || 'Success');
      } catch (wfErr) {
        console.warn('[Webform API] Outbound dispatch error:', wfErr);
      }
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const ownerEmail = process.env.OWNER_EMAIL || 'support@fileforge.ai';

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      // Send to owner
      await transporter.sendMail({
        from: `"FileForge AI Bug Desk" <${smtpUser}>`,
        to: ownerEmail,
        replyTo: email,
        subject: emailSubject,
        html: emailHtml
      });

      // Send acknowledgment receipt to user
      if (consent) {
        await transporter.sendMail({
          from: `"FileForge AI Support" <${smtpUser}>`,
          to: email,
          subject: `Received: Your FileForge AI Bug Report (${reportId})`,
          html: `
            <div style="font-family: sans-serif; background: #0b0913; color: #f6f4ff; padding: 24px; border-radius: 12px; max-width: 550px;">
              <h3 style="color: #a78bfa; margin-top: 0;">We received your bug report!</h3>
              <p style="line-height: 1.5; color: #a49cc4;">Thank you for helping improve FileForge AI. Our lead developer and engineering team have received your report (Reference: <strong style="color: #ff5fa2;">${reportId}</strong>) regarding <em>${tool}</em>.</p>
              <p style="line-height: 1.5; color: #a49cc4;">We review every report and will follow up with you if additional diagnostic information is needed.</p>
              <p style="margin-top: 24px; font-size: 12px; color: #6d5ae0;">— FileForge AI Engineering Team</p>
            </div>
          `
        }).catch((ackErr: unknown) => {
          console.warn('Failed to send confirmation ack email to reporter:', (ackErr as Error).message);
        });
      }
    } else if (!webformDispatched) {
      // In development or when neither Webform nor SMTP is configured, log the structured report
      console.log(`\n============================================================`);
      console.log(`[BUG REPORT LOGGED] ID: ${reportId}`);
      console.log(`From: ${name} <${email}>`);
      console.log(`Category: ${bugType} | Tool: ${tool}`);
      console.log(`Description: ${description}`);
      console.log(`Notice: To deliver directly to your inbox, set WEBFORM_API_KEY / WEB3FORMS_ACCESS_KEY or SMTP credentials in .env`);
      console.log(`============================================================\n`);
    }

    return NextResponse.json({
      success: true,
      reportId,
      message: 'Your bug report was sent successfully. Thank you for helping improve FileForge AI.'
    }, { status: 200 });

  } catch (err: unknown) {
    console.error('Failed to process bug report:', err);
    return NextResponse.json(
      { error: "We couldn't send your report. Please try again or email us directly at support@fileforge.ai." },
      { status: 500 }
    );
  }
}
