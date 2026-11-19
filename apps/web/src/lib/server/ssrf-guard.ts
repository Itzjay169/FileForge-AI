import { promises as dns } from 'dns';
import net from 'net';

/**
 * Server-Side Request Forgery (SSRF) Guard
 * Strictly blocks requests to private networks, loopbacks, cloud metadata endpoints, and internal infrastructure.
 */

// Private & reserved IPv4 blocks
const BLOCKED_IPV4_RANGES = [
  { start: '0.0.0.0', end: '0.255.255.255' },        // "This" network
  { start: '10.0.0.0', end: '10.255.255.255' },      // Private 10.0.0.0/8
  { start: '100.64.0.0', end: '100.127.255.255' },  // Carrier-grade NAT
  { start: '127.0.0.0', end: '127.255.255.255' },    // Loopback 127.0.0.0/8
  { start: '169.254.0.0', end: '169.254.255.255' },  // Link-local / AWS / GCP metadata
  { start: '172.16.0.0', end: '172.31.255.255' },    // Private 172.16.0.0/12
  { start: '192.0.0.0', end: '192.0.0.255' },        // IETF Protocol Assignments
  { start: '192.0.2.0', end: '192.0.2.255' },        // TEST-NET-1
  { start: '192.168.0.0', end: '192.168.255.255' },  // Private 192.168.0.0/16
  { start: '198.18.0.0', end: '198.19.255.255' },    // Benchmarking
  { start: '198.51.100.0', end: '198.51.100.255' },  // TEST-NET-2
  { start: '203.0.113.0', end: '203.0.113.255' },    // TEST-NET-3
  { start: '224.0.0.0', end: '239.255.255.255' },    // Multicast
  { start: '240.0.0.0', end: '255.255.255.255' }     // Reserved
];

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'metadata.google.internal',
  'metadata.internal',
  'instance-data',
  'kubernetes.default',
  '169.254.169.254'
]);

function ipToNumber(ip: string): number {
  return ip
    .split('.')
    .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function isIpInBlockedRange(ip: string): boolean {
  if (!net.isIPv4(ip)) {
    // Block all IPv6 local/mapped/private for URL imports (unless public)
    if (ip === '::1' || ip.startsWith('fe80:') || ip.startsWith('fc00:') || ip.startsWith('fd00:')) {
      return true;
    }
    // IPv4-mapped IPv6
    if (ip.startsWith('::ffff:')) {
      const ipv4 = ip.replace('::ffff:', '');
      return isIpInBlockedRange(ipv4);
    }
    return false;
  }

  const num = ipToNumber(ip);
  for (const range of BLOCKED_IPV4_RANGES) {
    const start = ipToNumber(range.start);
    const end = ipToNumber(range.end);
    if (num >= start && num <= end) {
      return true;
    }
  }
  return false;
}

export interface SsrfValidationResult {
  isValid: boolean;
  sanitizedUrl?: URL;
  resolvedIp?: string;
  error?: string;
}

export async function validateUrlForSsrf(urlString: string): Promise<SsrfValidationResult> {
  let parsed: URL;

  try {
    parsed = new URL(urlString.trim());
  } catch {
    return { isValid: false, error: 'Malformed URL provided.' };
  }

  // 1. Enforce HTTP/HTTPS only
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      isValid: false,
      error: `Unsupported protocol "${parsed.protocol}". Only HTTP and HTTPS are allowed.`
    };
  }

  // 2. Reject credentials embedded in URL
  if (parsed.username || parsed.password) {
    return {
      isValid: false,
      error: 'URLs containing embedded authentication credentials are not permitted.'
    };
  }

  // 3. Reject non-standard ports commonly used for internal services
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    const portNum = parseInt(parsed.port, 10);
    // Block common internal ports (redis, postgres, elasticsearch, docker, etc.)
    const dangerousPorts = [22, 25, 3306, 5432, 6379, 8080, 8443, 9000, 9200, 11211, 27017];
    if (dangerousPorts.includes(portNum)) {
      return {
        isValid: false,
        error: `Port ${portNum} is restricted for security.`
      };
    }
  }

  const hostname = parsed.hostname.toLowerCase();

  // 4. Check explicit blocked hostname list
  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    return {
      isValid: false,
      error: 'Access to internal infrastructure or loopback domains is strictly prohibited.'
    };
  }

  // 5. If hostname is already an IP, test directly
  if (net.isIP(hostname)) {
    if (isIpInBlockedRange(hostname)) {
      return {
        isValid: false,
        error: `Access to private IP address ${hostname} is blocked.`
      };
    }
    return { isValid: true, sanitizedUrl: parsed, resolvedIp: hostname };
  }

  // 6. Perform DNS lookup to verify target IP address
  try {
    const lookup = await dns.lookup(hostname, { all: true });
    if (!lookup || lookup.length === 0) {
      return { isValid: false, error: `Could not resolve domain ${hostname}.` };
    }

    for (const record of lookup) {
      if (isIpInBlockedRange(record.address)) {
        return {
          isValid: false,
          error: `Domain ${hostname} resolves to restricted private IP address (${record.address}). Request blocked.`
        };
      }
    }

    return {
      isValid: true,
      sanitizedUrl: parsed,
      resolvedIp: lookup[0].address
    };
  } catch (err: any) {
    return {
      isValid: false,
      error: `DNS resolution failed for ${hostname}: ${err.message || 'Host not found'}`
    };
  }
}
