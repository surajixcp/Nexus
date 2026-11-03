import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EscalationRecord, EscalationLevel } from '../../types';
import { EscalationBadge, StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  Flame,
  Clock,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Search,
  Filter,
  User,
  ExternalLink,
  Sparkles,
  ArrowRight,
  BellRing,
} from 'lucide-react';
import { formatSlaCountdown } from '../../utils/calculations';
import { Link } from 'react-router-dom';

export const EscalationCenterPage: React.FC = () => {
  const { escalations, incidents, escalateIncident, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Trigger Escalation Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIncId, setSelectedIncId] = useState(incidents[0]?.id || '');
  const [escLevel, setEscLevel] = useState<EscalationLevel>('L2');
  const [escReason, setEscReason] = useState('SLA breach imminent; latency degradation persisting.');
  const [escNotes, setEscNotes] = useState('');
  const [escTeam, setEscTeam] = useState('Demo PayWave L3 Engineering');
  const [escOwner, setEscOwner] = useState('Priya Sharma');

  // Active unmitigated incidents available to escalate
  const unescalatedIncidents = incidents.filter(
    (i) => i.status !== 'Resolved' && i.status !== 'Closed'
  );

  const filtered = escalations.filter((esc) => {
    const matchSearch =
      !search.trim() ||
      esc.ticketId.toLowerCase().includes(search.toLowerCase()) ||
      esc.title.toLowerCase().includes(search.toLowerCase()) ||
      esc.owner.toLowerCase().includes(search.toLowerCase()) ||
      esc.assignedTeam.toLowerCase().includes(search.toLowerCase());

    const matchLevel = levelFilter === 'All' || esc.level === levelFilter;
    const matchStatus = statusFilter === 'All' || esc.status === statusFilter;

    return matchSearch && matchLevel && matchStatus;
  });

  const handleManualEscalate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncId) return;
    escalateIncident(selectedIncId, escLevel, escReason, escNotes, escTeam, escOwner);
    setModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              PRIORITY ESCALATIONS
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-semibold">Tiered Hierarchy (L1 → L2 → L3 → Management)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Enterprise Escalation Management Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated SLA breach paging, senior tier assignment, and management escalation protocols.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-all"
        >
          <Flame className="w-4 h-4" />
          Trigger Manual Escalation
        </button>
      </div>

      {/* Escalation Hierarchy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-md">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-[#161c2e] text-slate-300 border border-[#252f4a]">
              Level 1 (L1)
            </span>
            <span className="text-xs text-slate-500 font-mono">T+0 min</span>
          </div>
          <h4 className="text-sm font-bold text-white mt-2">Operations & Triage</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            Initial intake, log verification, customer notification broadcast, and basic restart runbooks.
          </p>
          <div className="mt-3 text-[11px] font-semibold text-cyan-400">
            Target Ack: &lt; 15 mins
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/50 shadow-md">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-950/80 text-amber-300 border border-amber-700/60">
              Level 2 (L2)
            </span>
            <span className="text-xs text-slate-400 font-mono">T+15 min</span>
          </div>
          <h4 className="text-sm font-bold text-white mt-2">Application Engineering</h4>
          <p className="text-[11px] text-slate-300 mt-1">
            Deep dive into thread dumps, database lock contention, and microservice container profiling.
          </p>
          <div className="mt-3 text-[11px] font-semibold text-amber-400">
            Target SLA: &lt; 60 mins
          </div>
        </div>

        <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-800/50 shadow-md">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-orange-950/80 text-orange-300 border border-orange-700/60">
              Level 3 (L3)
            </span>
            <span className="text-xs text-slate-400 font-mono">T+30 min</span>
          </div>
          <h4 className="text-sm font-bold text-white mt-2">Principal Architecture</h4>
          <p className="text-[11px] text-slate-300 mt-1">
            Core infrastructure failover, third-party network NOC escalation, and live hotfix patching.
          </p>
          <div className="mt-3 text-[11px] font-semibold text-orange-400">
            Direct Bridge Lead
          </div>
        </div>

        <div className="p-4 rounded-xl bg-rose-950/25 border border-rose-800/60 shadow-md">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-rose-950/80 text-rose-300 border border-rose-700/60">
              Management
            </span>
            <span className="text-xs text-slate-400 font-mono">T+45 min</span>
          </div>
          <h4 className="text-sm font-bold text-white mt-2">Executive Command</h4>
          <p className="text-[11px] text-slate-300 mt-1">
            VP Service Delivery (Marcus Vance), CISO, and regulatory reporting for critical transactions.
          </p>
          <div className="mt-3 text-[11px] font-semibold text-rose-400">
            Executive Pager Active
          </div>
        </div>
      </div>

      {/* Active Escalations Table */}
      <div className="bg-[#0e1220] rounded-xl border border-[#1c243b] shadow-xl overflow-hidden">
        <div className="p-4 border-b border-[#1c243b] bg-[#0a0d18] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search escalations by ticket ID, application, owner..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#121626] border border-[#1f2842] rounded-md text-slate-200 focus:outline-hidden"
            >
              <option value="All">All Levels</option>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="L3">L3</option>
              <option value="Management">Management</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#121626] border border-[#1f2842] rounded-md text-slate-200 focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0a0d18] border-b border-[#1c243b] text-slate-400 font-semibold select-none">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Incident Title</th>
                <th className="py-3 px-4">Application</th>
                <th className="py-3 px-4">Escalation Reason</th>
                <th className="py-3 px-4">Owner & Team</th>
                <th className="py-3 px-4">Escalated At</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161c2e]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No active escalations recorded matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((esc) => (
                  <tr key={esc.id} className="hover:bg-[#121626] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                      <Link to={`/incidents?id=${esc.incidentId}`} className="hover:underline">
                        {esc.ticketId}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <EscalationBadge level={esc.level} />
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200 max-w-xs truncate">
                      {esc.title}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{esc.application}</td>
                    <td className="py-3 px-4 text-slate-300 max-w-sm truncate">
                      {esc.reason}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block">{esc.owner}</span>
                      <span className="text-[10px] text-slate-400">{esc.assignedTeam}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap font-mono">
                      {new Date(esc.escalatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          esc.status === 'Active'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                        }`}
                      >
                        {esc.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Escalation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Trigger Enterprise Escalation"
        description="Select an active incident and advance its operational escalation level."
        maxWidth="lg"
      >
        <form onSubmit={handleManualEscalate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Target Incident <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={selectedIncId}
              onChange={(e) => setSelectedIncId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white focus:outline-hidden focus:border-cyan-500"
            >
              {unescalatedIncidents.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.ticketId} — {i.title} ({i.severity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Escalation Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['L1', 'L2', 'L3', 'Management'] as EscalationLevel[]).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setEscLevel(lvl)}
                  className={`py-2 text-xs font-bold rounded-lg border text-center transition-all ${
                    escLevel === lvl
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-500 shadow-md shadow-amber-950/40'
                      : 'bg-[#121626] border-[#1f2842] text-slate-300 hover:bg-[#181d33]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Assigned Team
              </label>
              <input
                type="text"
                required
                value={escTeam}
                onChange={(e) => setEscTeam(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Escalation Owner
              </label>
              <input
                type="text"
                required
                value={escOwner}
                onChange={(e) => setEscOwner(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Escalation Reason
            </label>
            <input
              type="text"
              required
              value={escReason}
              onChange={(e) => setEscReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Technical Context & Handoff Notes
            </label>
            <textarea
              rows={3}
              value={escNotes}
              onChange={(e) => setEscNotes(e.target.value)}
              placeholder="Provide diagnostic output, core dump locations, and urgent instructions for the on-call engineer..."
              className="w-full px-3 py-2 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1c243b]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-lg shadow-md shadow-amber-950/40"
            >
              Dispatch Escalation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
