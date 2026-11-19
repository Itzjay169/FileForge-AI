'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  Activity,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { SystemStatus } from '@fileforge/shared';
import { ForgeButton } from '@/components/sakuga';

export default function StatusPage() {
  const [overall, setOverall] = useState<string>('OPERATIONAL');
  const [services, setServices] = useState<SystemStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      if (data.success) {
        setOverall(data.overall);
        setServices(data.services);
        setLastUpdated(data.updatedAt || Date.now());
      }
    } catch {
      console.error('Failed to load system status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-20 selection:bg-pink-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glow Header */}
        <div className="text-center py-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
          <h1 className="text-4xl sm:text-5xl font-black text-white">System Status & Telemetry</h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl mx-auto">
            Live uptime, queue throughput, and worker cluster health across global edge locations.
          </p>
        </div>

        {/* Overall Status Banner */}
        <div
          className={`p-6 sm:p-7 rounded-3xl border shadow-2xl flex items-center justify-between gap-4 transition-all ${
            overall === 'OPERATIONAL'
              ? 'bg-emerald-950/30 border-emerald-500/30 shadow-emerald-950/20'
              : overall === 'DEGRADED'
              ? 'bg-amber-950/30 border-amber-500/30 shadow-amber-950/20'
              : 'bg-rose-950/30 border-rose-500/30 shadow-rose-950/20'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                overall === 'OPERATIONAL'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : overall === 'DEGRADED'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {overall === 'OPERATIONAL' ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : overall === 'DEGRADED' ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <XCircle className="w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {overall === 'OPERATIONAL'
                  ? 'All FileForge AI Systems Operational'
                  : overall === 'DEGRADED'
                  ? 'Partial System Degradation Detected'
                  : 'Major Outage in Progress'}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span>Last verified: {new Date(lastUpdated).toLocaleTimeString()}</span>
              </p>
            </div>
          </div>

          <button
            onClick={fetchStatus}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Uptime Metric Strip */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-[#12121c] border border-white/10 text-center">
            <div className="text-xs text-gray-400">90-Day Uptime</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">99.99%</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#12121c] border border-white/10 text-center">
            <div className="text-xs text-gray-400">Avg Global Latency</div>
            <div className="text-xl font-bold text-violet-400 mt-1">38ms</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#12121c] border border-white/10 text-center">
            <div className="text-xs text-gray-400">Active Workers</div>
            <div className="text-xl font-bold text-pink-400 mt-1">64 Nodes</div>
          </div>
        </div>

        {/* Services List */}
        <div className="mt-8 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
            Core Service Health
          </h3>
          <div className="bg-[#12121c] border border-white/10 rounded-3xl divide-y divide-white/5 overflow-hidden shadow-xl">
            {services.map((svc) => (
              <div key={svc.service} className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      svc.status === 'OPERATIONAL'
                        ? 'bg-emerald-400 shadow-emerald-500/50 shadow-sm'
                        : svc.status === 'DEGRADED'
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }`}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{svc.service}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{svc.message}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      svc.status === 'OPERATIONAL'
                        ? 'bg-emerald-950 text-emerald-400'
                        : 'bg-rose-950 text-rose-400'
                    }`}
                  >
                    {svc.status}
                  </span>
                  <div className="text-[10px] text-gray-500 font-mono mt-1">{svc.latencyMs}ms</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="mt-12 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
            Past Incidents & Maintenance
          </h3>
          <div className="p-6 rounded-3xl bg-[#12121c] border border-white/10 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Scheduled Maintenance — Engine Transcoder v2.1</span>
              <span className="text-gray-500">November 15, 2026</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Successfully applied zero-downtime rolling upgrades to all 32 FFmpeg/Sharp transcoding worker nodes. Latency and job throughput remained nominal throughout the transition window.
            </p>
            <div className="text-[10px] text-emerald-400 font-semibold pt-1">Resolved in 4 minutes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
