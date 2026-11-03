import React from 'react';
import { TrackerRecord } from '../../types';
import { SeverityBadge } from '../ui/Badge';
import { X, Clock, CheckCircle2, AlertCircle, Copy, Printer, FileText } from 'lucide-react';
import { formatDuration } from '../../utils/calculations';
import { useApp } from '../../context/AppContext';

interface TrackerDetailsDrawerProps {
  record: TrackerRecord | null;
  onClose: () => void;
}

export const TrackerDetailsDrawer: React.FC<TrackerDetailsDrawerProps> = ({ record, onClose }) => {
  const { addToast } = useApp();

  if (!record) return null;

  const copyDetails = () => {
    const text = `
Problem ID: ${record.problemId}
Application: ${record.application}
Severity: ${record.severity}
Alert: ${record.alertDescription}
Impacted Entity: ${record.impactedEntity}
Start: ${record.startDateTime}
Reported: ${record.reportedDateTime}
End: ${record.endDateTime}
Duration: ${formatDuration(record.durationMinutes)} (${record.durationMinutes}m)
MTTR: ${formatDuration(record.reportedDurationMinutes)} (${record.reportedDurationMinutes}m)
Troubleshooting: ${record.troubleshootingNotes}
Resolution: ${record.resolutionSteps}
    `.trim();

    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', `Details for ${record.problemId} copied!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full z-50 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                #{record.srNo} · {record.problemId}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {record.application}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={copyDetails}
                aria-label="Copy record details"
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Copy record details"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                aria-label="Close record drawer"
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
            {record.alertDescription}
          </h2>

          <div className="flex items-center gap-3 mt-3">
            <SeverityBadge severity={record.severity} />
            <span
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                record.status === 'Resolved'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
              }`}
            >
              {record.status === 'Resolved' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5 animate-spin" />
              )}
              {record.status}
            </span>
            <span className="text-xs text-slate-500">
              Ack Received:{' '}
              <strong className={record.acknowledgementReceived === 'Yes' ? 'text-emerald-600' : 'text-red-500'}>
                {record.acknowledgementReceived}
              </strong>
            </span>
          </div>
        </div>

        {/* 24-Column Data Fields in Formatted Cards */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Duration Metrics Banner */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-0.5">
                Total Incident Duration (End − Start)
              </span>
              <p className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {formatDuration(record.durationMinutes)}
              </p>
              <span className="text-[10px] text-slate-500 font-mono">({record.durationMinutes} minutes)</span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-0.5">
                Reported MTTR (End − Reported)
              </span>
              <p className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {formatDuration(record.reportedDurationMinutes)}
              </p>
              <span className="text-[10px] text-slate-500 font-mono">({record.reportedDurationMinutes} minutes)</span>
            </div>
          </div>

          {/* Timestamps Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Operational Timestamps
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px]">Start Date & Time</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {record.startDateTime}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px]">Reported Date & Time</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {record.reportedDateTime}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[10px]">End Date & Time</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {record.endDateTime}
                </span>
              </div>
            </div>
          </div>

          {/* Impacted Entity & Reporter */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-400 block text-[10px]">Impacted Entity / Hostname</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {record.impactedEntity}
              </span>
            </div>
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-400 block text-[10px]">Reported By</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {record.reportedBy}
              </span>
            </div>
          </div>

          {/* Escalation Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Escalation Details
            </h4>
            <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-slate-700 dark:text-slate-300">
              {record.escalationDetails}
            </div>
          </div>

          {/* Troubleshooting / Analysis */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Troubleshooting & Diagnostic Analysis (Shared with Support Team)
            </h4>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
              {record.troubleshootingNotes}
            </div>
          </div>

          {/* Response from Support Team */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Response from Support Team
            </h4>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
              {record.supportResponse}
            </div>
          </div>

          {/* Resolution Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Final Resolution Steps
            </h4>
            <div className="p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs text-emerald-900 dark:text-emerald-200 font-mono whitespace-pre-wrap leading-relaxed">
              {record.resolutionSteps || 'Under active diagnostic investigation.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
