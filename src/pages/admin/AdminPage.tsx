import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockUsers';
import { Modal } from '../../components/ui/Modal';
import {
  ShieldCheck,
  Users,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Lock,
  Mail,
  Server,
  Layers,
} from 'lucide-react';
import { UserRole } from '../../types';

export const AdminPage: React.FC = () => {
  const { resetDemoData, applications } = useApp();
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const usersList = Object.values(DEMO_USERS);

  const slaPolicies = [
    { severity: 'Critical (P1)', resolutionSla: '60 minutes', ackSla: '15 minutes', escalation: 'Immediate L2 + Executive Paging at 45m' },
    { severity: 'High (P2)', resolutionSla: '240 minutes (4h)', ackSla: '30 minutes', escalation: 'L2 at 60m + L3 at 120m' },
    { severity: 'Medium (P3)', resolutionSla: '720 minutes (12h)', ackSla: '120 minutes', escalation: 'Queue review within standard shift' },
    { severity: 'Low (P4)', resolutionSla: '1440 minutes (24h)', ackSla: '240 minutes', escalation: 'Next release maintenance sprint' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950/70 text-cyan-300 border border-indigo-800">
              GOVERNANCE & CONTROLS
            </span>
            <span className="text-xs text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-semibold">Enterprise RBAC & SLA Matrix</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            System Administration & Demo Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure access control, enterprise SLA response policies, and maintain demo state.
          </p>
        </div>

        <button
          onClick={() => setResetModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-md shadow-rose-950/50 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Demo Data</span>
        </button>
      </div>

      {/* User Management Table */}
      <div className="p-5 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Active Enterprise Users & Demo Roles ({usersList.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0a0d18] border-b border-[#1c243b] text-slate-400 font-semibold select-none">
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Email Address</th>
                <th className="py-2.5 px-3">Permissions Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161c2e]">
              {usersList.map((usr) => (
                <tr key={usr.id} className="hover:bg-[#121626] transition-colors">
                  <td className="py-2.5 px-3 flex items-center gap-2.5">
                    <img src={usr.avatar} alt={usr.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700" />
                    <span className="font-semibold text-white">{usr.name}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        usr.role === 'Admin'
                          ? 'bg-purple-950/80 text-purple-300 border-purple-800/60'
                          : usr.role === 'Support Engineer'
                          ? 'bg-indigo-950/80 text-cyan-300 border-indigo-800/60'
                          : usr.role === 'Manager'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                          : 'bg-[#161c2e] text-slate-300 border-[#232e4d]'
                      }`}
                    >
                      {usr.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{usr.department}</td>
                  <td className="py-2.5 px-3 font-mono text-cyan-400">{usr.email}</td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {usr.role === 'Admin'
                      ? 'Full Super-Admin Control & Data Reset'
                      : usr.role === 'Support Engineer'
                      ? 'Triage, Escalate & Resolve Incidents'
                      : usr.role === 'Manager'
                      ? 'SLA Governance & Executive Oversight'
                      : 'Intake Reporting & Status Tracking'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLA Policy Matrix */}
      <div className="p-5 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Configured Enterprise SLA Policies</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0a0d18] border-b border-[#1c243b] text-slate-400 font-semibold select-none">
                <th className="py-2.5 px-3">Severity Tier</th>
                <th className="py-2.5 px-3">Target Resolution MTTR</th>
                <th className="py-2.5 px-3">Initial ACK SLA</th>
                <th className="py-2.5 px-3">Automated Escalation Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161c2e]">
              {slaPolicies.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#121626] transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white">{p.severity}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{p.resolutionSla}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{p.ackSla}</td>
                  <td className="py-2.5 px-3 text-slate-300">{p.escalation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Demo Data Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset All Synthetic Demo Data"
        description="Permanently restore all initial records and purge browser LocalStorage changes."
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            This will immediately reload the 32 initial incidents, 32 spreadsheet rows, 15 enterprise documents, and 10 runbooks.
          </p>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1c243b]">
            <button
              onClick={() => setResetModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white bg-[#121626] border border-[#1f2842] rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                resetDemoData();
                setResetModalOpen(false);
              }}
              className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-md shadow-rose-950/40"
            >
              Confirm Full Reset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
