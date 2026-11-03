import React from 'react';
import { Severity, Priority, IncidentStatus, EscalationLevel } from '../../types';

export const SeverityBadge: React.FC<{ severity: Severity; size?: 'sm' | 'md' }> = ({
  severity,
  size = 'md',
}) => {
  const styles: Record<Severity, string> = {
    Critical: 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-xs shadow-rose-950/40 font-bold',
    High: 'bg-orange-500/15 text-orange-300 border-orange-500/40 font-semibold',
    Medium: 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-medium',
    Low: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-medium',
  };

  const dotColors: Record<Severity, string> = {
    Critical: 'bg-rose-400 animate-ping',
    High: 'bg-orange-400',
    Medium: 'bg-amber-400',
    Low: 'bg-cyan-400',
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border tracking-tight ${styles[severity] || styles.Low} ${sizeClass}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[severity] || dotColors.Low}`} />
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${severity === 'Critical' ? 'bg-rose-500' : dotColors[severity] || 'bg-cyan-500'}`} />
      </span>
      {severity}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const styles: Record<Priority, string> = {
    P1: 'bg-rose-500/20 text-rose-200 border-rose-500/50 font-bold shadow-xs shadow-rose-950/30',
    P2: 'bg-amber-500/20 text-amber-200 border-amber-500/50 font-bold',
    P3: 'bg-blue-500/20 text-blue-200 border-blue-500/50 font-medium',
    P4: 'bg-slate-800/80 text-slate-300 border-slate-700/60 font-normal',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border font-mono ${styles[priority]}`}>
      {priority}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: IncidentStatus }> = ({ status }) => {
  const styles: Record<IncidentStatus, string> = {
    Open: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/35 font-medium',
    Acknowledged: 'bg-purple-500/15 text-purple-300 border-purple-500/35 font-medium',
    'In Progress': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35 font-medium',
    Escalated: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold',
    Resolved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 font-medium',
    Closed: 'bg-slate-800/60 text-slate-400 border-slate-700/50 font-normal',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${styles[status] || styles.Open}`}
    >
      {status}
    </span>
  );
};

export const EscalationBadge: React.FC<{ level: EscalationLevel }> = ({ level }) => {
  const styles: Record<EscalationLevel, string> = {
    L1: 'bg-slate-800/80 text-slate-300 border-slate-700 font-medium',
    L2: 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-semibold',
    L3: 'bg-orange-500/15 text-orange-300 border-orange-500/40 font-semibold',
    Management: 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold shadow-xs',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border font-mono ${styles[level]}`}>
      {level}
    </span>
  );
};

export const SLARiskBadge: React.FC<{ status: 'Breached' | 'Warning' | 'Running' | 'Paused' | 'Met' }> = ({ status }) => {
  const styles = {
    Breached: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold',
    Warning: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold',
    Running: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-medium',
    Paused: 'bg-slate-700/40 text-slate-300 border-slate-600/50 font-medium',
    Met: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold',
  };

  const dots = {
    Breached: 'bg-rose-400',
    Warning: 'bg-amber-400',
    Running: 'bg-cyan-400',
    Paused: 'bg-slate-400',
    Met: 'bg-emerald-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
};

