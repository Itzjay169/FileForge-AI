'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  CreditCard,
  HardDrive,
  Activity,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Ticket,
  Server,
  Search,
  UserX,
  UserCheck,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';
import {
  AdminDashboardStats,
  AdminUserRecord,
  AdminJobRecord,
  FeatureFlag,
  SupportTicket,
  SystemStatus,
  formatBytes
} from '@fileforge/shared';
import { SakugaButton } from '@/components/ui/sakuga-button';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [jobs, setJobs] = useState<AdminJobRecord[]>([]);
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [statuses, setStatuses] = useState<SystemStatus[]>([]);
  const [searchUser, setSearchUser] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'flags' | 'tickets' | 'health'>('overview');
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, jobsRes, flagsRes, ticketsRes, statusRes] = await Promise.all([
        fetch('/api/admin/dashboard').then((r) => r.json()),
        fetch('/api/admin/users?limit=10').then((r) => r.json()),
        fetch('/api/admin/jobs?limit=10').then((r) => r.json()),
        fetch('/api/admin/feature-flags').then((r) => r.json()),
        fetch('/api/admin/support').then((r) => r.json()),
        fetch('/api/status').then((r) => r.json())
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users);
      if (jobsRes.success) setJobs(jobsRes.jobs);
      if (flagsRes.success) setFlags(flagsRes.flags);
      if (ticketsRes.success) setTickets(ticketsRes.tickets);
      if (statusRes.success) setStatuses(statusRes.services);
    } catch (e) {
      console.error('Failed to load admin telemetry', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleFlag = async (flag: FeatureFlag) => {
    try {
      const res = await fetch('/api/admin/feature-flags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: flag.id, enabled: !flag.enabled })
      });
      const data = await res.json();
      if (data.success) {
        setFlags((prev) => prev.map((f) => (f.id === flag.id ? data.flag : f)));
      }
    } catch {
      alert('Failed to toggle feature flag');
    }
  };

  const handleBanToggle = async (user: AdminUserRecord) => {
    const action = user.isBanned ? 'unban' : 'ban';
    const reason = user.isBanned ? undefined : prompt('Enter ban reason:') || 'Administrative action';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, action, reason })
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isBanned: !user.isBanned, banReason: reason } : u))
        );
      }
    } catch {
      alert('Failed to execute ban action');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pt-24 pb-20 selection:bg-pink-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
              <span className="text-xs uppercase tracking-widest font-extrabold text-pink-400">
                Command Center
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">Admin Operations & Analytics</h1>
            <p className="text-xs text-gray-400 mt-1">
              Live cluster telemetry, revenue metrics, feature gates, and security supervision.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <SakugaButton variant="secondary" className="text-xs">
                Back to User Dashboard
              </SakugaButton>
            </Link>
            <SakugaButton variant="default" onClick={fetchAdminData} className="text-xs flex items-center gap-2">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </SakugaButton>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 border-b border-white/5">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'users', label: 'Users & Accounts', icon: Users },
            { id: 'jobs', label: 'Processing Jobs', icon: FileText },
            { id: 'flags', label: 'Feature Flags', icon: ToggleRight },
            { id: 'tickets', label: 'Support Tickets', icon: Ticket },
            { id: 'health', label: 'Infrastructure', icon: Server }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg shadow-violet-900/40'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#12121c] border border-white/10 shadow-lg">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs font-semibold">Total Users</span>
                  <Users className="w-4 h-4 text-violet-400" />
                </div>
                <div className="text-2xl font-black text-white mt-2">{stats?.totalUsers || 0}</div>
                <div className="text-[11px] text-emerald-400 mt-1">+{stats?.activeSubscriptions} active subs</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#12121c] border border-white/10 shadow-lg">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs font-semibold">Monthly MRR</span>
                  <CreditCard className="w-4 h-4 text-pink-400" />
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  ${stats ? (stats.monthlyRevenueCents / 100).toLocaleString() : '0'}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">Stripe & Razorpay</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#12121c] border border-white/10 shadow-lg">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs font-semibold">Total Storage</span>
                  <HardDrive className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  {stats ? formatBytes(stats.totalStorageBytes) : '0 B'}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">Across 3 regions</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#12121c] border border-white/10 shadow-lg">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs font-semibold">Jobs Processed</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  {stats?.totalJobsProcessed?.toLocaleString() || 0}
                </div>
                <div className="text-[11px] text-rose-400 mt-1">{stats?.failedJobsLast24h || 0} failed (24h)</div>
              </div>
            </div>

            {/* Quick Overview Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Jobs */}
              <div className="p-6 rounded-3xl bg-[#12121c] border border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-violet-400" />
                    Live Job Queue
                  </h3>
                  <button onClick={() => setActiveTab('jobs')} className="text-xs text-violet-400 hover:underline">
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {jobs.slice(0, 5).map((job) => (
                    <div
                      key={job.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 font-mono text-[10px]">
                            {job.type}
                          </span>
                          <span>
                            {job.inputFormat.toUpperCase()} → {job.outputFormat.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {formatBytes(job.inputSizeBytes)} • User: {job.userId}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            job.status === 'COMPLETED'
                              ? 'bg-emerald-950 text-emerald-400'
                              : job.status === 'FAILED'
                              ? 'bg-rose-950 text-rose-400'
                              : 'bg-amber-950 text-amber-400'
                          }`}
                        >
                          {job.status}
                        </span>
                        {job.durationMs && <div className="text-[10px] text-gray-500 mt-1">{job.durationMs}ms</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infrastructure Quick Status */}
              <div className="p-6 rounded-3xl bg-[#12121c] border border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-pink-400" />
                    Cluster Health
                  </h3>
                  <button onClick={() => setActiveTab('health')} className="text-xs text-pink-400 hover:underline">
                    View telemetry
                  </button>
                </div>
                <div className="space-y-3">
                  {statuses.slice(0, 5).map((svc) => (
                    <div
                      key={svc.service}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            svc.status === 'OPERATIONAL' ? 'bg-emerald-400' : 'bg-rose-400'
                          }`}
                        />
                        <span className="font-semibold text-white">{svc.service}</span>
                      </div>
                      <span className="text-gray-400 font-mono text-[11px]">{svc.latencyMs}ms</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full bg-[#12121c] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="bg-[#12121c] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-gray-400 font-semibold border-b border-white/5">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Plan</th>
                    <th className="p-4">Storage Used</th>
                    <th className="p-4">Total Jobs</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users
                    .filter(
                      (u) =>
                        !searchUser ||
                        u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
                        (u.name && u.name.toLowerCase().includes(searchUser.toLowerCase()))
                    )
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.02]">
                        <td className="p-4">
                          <div className="font-bold text-white">{user.name || 'Anonymous User'}</div>
                          <div className="text-[11px] text-gray-400 font-mono">{user.email}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-violet-950/60 text-violet-300 font-bold text-[10px]">
                            {user.planTier}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300">{formatBytes(user.storageUsedBytes)}</td>
                        <td className="p-4 text-gray-300">{user.jobCount}</td>
                        <td className="p-4">
                          {user.isBanned ? (
                            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 text-[10px] font-bold">
                              Banned
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleBanToggle(user)}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              user.isBanned
                                ? 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                                : 'bg-rose-950 text-rose-400 hover:bg-rose-900'
                            }`}
                          >
                            {user.isBanned ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Feature Flags Tab */}
        {activeTab === 'flags' && (
          <div className="mt-8 space-y-4">
            {flags.map((flag) => (
              <div
                key={flag.id}
                className="p-5 rounded-2xl bg-[#12121c] border border-white/10 flex items-center justify-between gap-6 shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-white">{flag.name}</h3>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-gray-400">
                      {flag.id}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{flag.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {flag.planTiers.map((tier) => (
                      <span key={tier} className="text-[10px] px-2 py-0.5 rounded bg-violet-950/60 text-violet-300">
                        {tier}
                      </span>
                    ))}
                    <span className="text-[10px] text-gray-500">• Rollout: {flag.percentage}%</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleFlag(flag)}
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  {flag.enabled ? (
                    <ToggleRight className="w-8 h-8 text-pink-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-600" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Support Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="mt-8 space-y-4">
            {tickets.map((tkt) => (
              <div key={tkt.id} className="p-5 rounded-2xl bg-[#12121c] border border-white/10 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tkt.priority === 'HIGH' ? 'bg-rose-950 text-rose-400' : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      {tkt.priority}
                    </span>
                    <h3 className="text-sm font-bold text-white">{tkt.subject}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tkt.status === 'RESOLVED'
                        ? 'bg-emerald-950 text-emerald-400'
                        : tkt.status === 'IN_PROGRESS'
                        ? 'bg-amber-950 text-amber-400'
                        : 'bg-violet-950 text-violet-400'
                    }`}
                  >
                    {tkt.status}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{tkt.body}</p>
                <div className="text-[11px] text-gray-500 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span>From: {tkt.userEmail}</span>
                  <span>ID: {tkt.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Infrastructure Tab */}
        {activeTab === 'health' && (
          <div className="mt-8 space-y-4">
            {statuses.map((svc) => (
              <div
                key={svc.service}
                className="p-5 rounded-2xl bg-[#12121c] border border-white/10 flex items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3.5 h-3.5 rounded-full ${
                      svc.status === 'OPERATIONAL' ? 'bg-emerald-400 shadow-emerald-500/50 shadow-sm' : 'bg-rose-400'
                    }`}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{svc.service}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{svc.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs text-violet-400 font-bold">{svc.latencyMs}ms</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Global edge</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="mt-8 space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-xl bg-[#12121c] border border-white/10 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 font-mono text-[10px]">
                      {job.type}
                    </span>
                    <span>
                      {job.inputFormat.toUpperCase()} → {job.outputFormat.toUpperCase()}
                    </span>
                    <span className="text-gray-500 font-mono text-[11px]">({job.id})</span>
                  </div>
                  {job.error && <p className="text-[11px] text-rose-400 mt-1">{job.error}</p>}
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      job.status === 'COMPLETED'
                        ? 'bg-emerald-950 text-emerald-400'
                        : job.status === 'FAILED'
                        ? 'bg-rose-950 text-rose-400'
                        : 'bg-amber-950 text-amber-400'
                    }`}
                  >
                    {job.status}
                  </span>
                  <div className="text-[10px] text-gray-500 mt-1">{formatBytes(job.inputSizeBytes)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
