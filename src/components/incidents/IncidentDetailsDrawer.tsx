import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Incident, IncidentStatus } from '../../types';
import { SeverityBadge, PriorityBadge, StatusBadge, EscalationBadge } from '../ui/Badge';
import {
  X,
  Clock,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
  MessageSquare,
  FileText,
  User,
  Activity,
  Send,
  ExternalLink,
} from 'lucide-react';
import { formatSlaCountdown, calculateDurationMinutes, formatDuration } from '../../utils/calculations';
import { ResolveIncidentModal } from '../modals/ResolveIncidentModal';
import { EscalateIncidentModal } from '../modals/EscalateIncidentModal';

interface IncidentDetailsDrawerProps {
  incident: Incident | null;
  onClose: () => void;
}

export const IncidentDetailsDrawer: React.FC<IncidentDetailsDrawerProps> = ({
  incident,
  onClose,
}) => {
  const {
    updateIncident,
    chatMessages,
    addChatMessage,
    currentUser,
    knowledgeArticles,
    incidents,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'ai' | 'chat' | 'tracker'>('overview');
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);

  // Chat message input
  const [commentText, setCommentText] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);

  if (!incident) return null;

  // Calculate elapsed SLA
  const createdTime = new Date(incident.createdAt).getTime();
  const elapsedMinutes = Math.max(0, Math.round((Date.now() - createdTime) / 60000));
  const slaInfo = formatSlaCountdown(elapsedMinutes, incident.severity);

  // Relevant chat messages
  const incidentChats = chatMessages.filter((m) => m.incidentId === incident.id);

  // Relevant articles
  const matchingArticles = knowledgeArticles.filter(
    (a) =>
      a.tags.some((t) => incident.application.toLowerCase().includes(t.toLowerCase())) ||
      a.category.toLowerCase() === incident.category.toLowerCase() ||
      incident.title.toLowerCase().includes(a.title.toLowerCase().slice(0, 15))
  );

  // Similar historical incidents
  const similarIncidents = incidents.filter(
    (i) => i.id !== incident.id && i.application === incident.application
  ).slice(0, 3);

  const handleStatusChange = (newStatus: IncidentStatus) => {
    updateIncident(incident.id, { status: newStatus });
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addChatMessage(incident.id, commentText, isInternalComment);
    setCommentText('');
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex justify-end">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Drawer panel */}
        <div className="relative w-full max-w-2xl bg-[#0c0f1c] border-l border-[#1b233a] shadow-2xl flex flex-col h-full z-50 animate-in slide-in-from-right duration-300 text-slate-100">
          {/* Header */}
          <div className="p-5 border-b border-[#1b233a] bg-[#0a0d18]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/35">
                  {incident.ticketId}
                </span>
                <span className="text-xs text-slate-600">·</span>
                <span className="text-xs font-semibold text-slate-200">
                  {incident.application}
                </span>
                <span className="text-xs text-slate-600">/</span>
                <span className="text-xs text-slate-400">{incident.service}</span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close details drawer"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#181f33] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-base font-bold text-white leading-snug">
              {incident.title}
            </h2>

            {/* Badges and SLA Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
              <div className="flex items-center gap-2">
                <SeverityBadge severity={incident.severity} />
                <PriorityBadge priority={incident.priority} />
                <StatusBadge status={incident.status} />
                {incident.escalationLevel && (
                  <EscalationBadge level={incident.escalationLevel} />
                )}
              </div>

              {/* SLA Indicator */}
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  slaInfo.breached
                    ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{incident.status === 'Resolved' || incident.status === 'Closed' ? 'SLA Met' : slaInfo.text}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 overflow-x-auto">
              {incident.status !== 'Resolved' && incident.status !== 'Closed' && (
                <>
                  <button
                    onClick={() => setResolveModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors shrink-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Resolve Incident
                  </button>

                  <button
                    onClick={() => setEscalateModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 rounded-lg shadow-2xs transition-colors shrink-0"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    Escalate
                  </button>
                </>
              )}

              {/* Status Switcher Select */}
              <div className="flex items-center gap-1.5 ml-auto text-xs shrink-0">
                <span className="text-slate-400">Status:</span>
                <select
                  value={incident.status}
                  onChange={(e) => handleStatusChange(e.target.value as IncidentStatus)}
                  className="px-2.5 py-1 text-xs font-medium bg-[#121626] border border-[#1f2842] rounded-lg focus:outline-hidden focus:border-cyan-500 text-white"
                >
                  <option value="Open">Open</option>
                  <option value="Acknowledged">Acknowledged</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Escalated">Escalated</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-[#1b233a] px-5 text-xs font-medium bg-[#0a0d18] shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3 border-b-2 transition-colors shrink-0 ${
                activeTab === 'overview'
                  ? 'border-cyan-400 text-cyan-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Overview & Details
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === 'ai'
                  ? 'border-cyan-400 text-cyan-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              AI Troubleshooting
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3 px-3 border-b-2 transition-colors shrink-0 ${
                activeTab === 'timeline'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Lifecycle Timeline
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === 'chat'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Team Notes ({incidentChats.length})
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Incident Description
                  </h4>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                    {incident.description}
                  </div>
                </div>

                {/* Key Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <span className="text-slate-400 block mb-1">Impacted Entity</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                      {incident.impactedEntity}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <span className="text-slate-400 block mb-1">Environment</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {incident.environment}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <span className="text-slate-400 block mb-1">Assigned Support Team</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {incident.assignedTeam}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <span className="text-slate-400 block mb-1">Reported By</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {incident.reporter.name} ({incident.reporter.department})
                    </span>
                  </div>
                </div>

                {/* Impact & Urgency */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <h5 className="font-bold text-slate-600 dark:text-slate-400 mb-1">Impact Assessment</h5>
                    <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      {incident.impact}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-600 dark:text-slate-400 mb-1">Urgency Justification</h5>
                    <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      {incident.urgency}
                    </p>
                  </div>
                </div>

                {/* Resolution Notes if Resolved */}
                {incident.resolutionNotes && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Resolution Report & Root Cause
                    </div>
                    {incident.rootCause && (
                      <p className="text-xs text-slate-700 dark:text-slate-300 mb-2">
                        <strong>Root Cause:</strong> {incident.rootCause}
                      </p>
                    )}
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      <strong>Resolution:</strong> {incident.resolutionNotes}
                    </p>
                  </div>
                )}

                {/* Attachments */}
                {incident.attachments && incident.attachments.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Attachments & Logs ({incident.attachments.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {incident.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono"
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{att}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI TROUBLESHOOTING TAB */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/40 border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-bold text-xs mb-1">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>AI Troubleshooting Intelligence</span>
                    <span className="text-[10px] ml-auto font-normal px-2 py-0.5 rounded bg-indigo-200/50 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
                      AI SIMULATION · NOT CONNECTED TO A LIVE MODEL
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Automated diagnosis synthesized from past incident resolutions, cluster telemetry, and enterprise SOP runbooks.
                  </p>
                </div>

                {/* Recommended Resolution Steps */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2">
                    Predicted Troubleshooting Sequence
                  </h4>
                  <ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-indigo-600">1.</span>
                      <span>Inspect active connection pools and JVM heap utilization on <code>{incident.impactedEntity}</code>.</span>
                    </li>
                    <li className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-indigo-600">2.</span>
                      <span>Drain upstream load balancer target to prevent cascaded thread exhaustion.</span>
                    </li>
                    <li className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-indigo-600">3.</span>
                      <span>Capture thread dump via <code>jcmd &lt;pid&gt; Thread.print</code> before triggering rolling restart.</span>
                    </li>
                  </ol>
                </div>

                {/* Recommended Knowledge Articles */}
                {matchingArticles.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2">
                      Matching Runbooks & Knowledge Articles
                    </h4>
                    <div className="space-y-2">
                      {matchingArticles.map((art) => (
                        <div
                          key={art.id}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all bg-white dark:bg-slate-800/60"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                              {art.title}
                            </span>
                            <span className="text-[11px] text-slate-400">{art.helpfulCount} engineers found helpful</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                            {art.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Similar Historical Incidents */}
                {similarIncidents.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2">
                      Similar Historical Incidents ({incident.application})
                    </h4>
                    <div className="space-y-2">
                      {similarIncidents.map((sim) => (
                        <div
                          key={sim.id}
                          className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{sim.ticketId}</span>
                            <StatusBadge status={sim.status} />
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 line-clamp-1">{sim.title}</p>
                          {sim.resolutionNotes && (
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 line-clamp-1">
                              <strong>Resolution:</strong> {sim.resolutionNotes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TIMELINE TAB */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Incident State Transitions
                </h4>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  <div className="relative">
                    <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-900" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Incident Created</p>
                    <p className="text-[11px] text-slate-400">{new Date(incident.createdAt).toLocaleString()}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Logged by {incident.reporter.name}</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-purple-500 ring-4 ring-white dark:ring-slate-900" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Assigned & Acknowledged</p>
                    <p className="text-[11px] text-slate-400">{incident.acknowledgedAt ? new Date(incident.acknowledgedAt).toLocaleString() : 'Acknowledged during triage'}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Assigned to {incident.assignedTeam}</p>
                  </div>

                  {incident.escalationLevel && (
                    <div className="relative">
                      <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-amber-500 ring-4 ring-white dark:ring-slate-900" />
                      <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Escalated to {incident.escalationLevel}</p>
                      <p className="text-[11px] text-slate-400">{new Date(incident.updatedAt).toLocaleString()}</p>
                    </div>
                  )}

                  {incident.resolvedAt && (
                    <div className="relative">
                      <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Incident Resolved</p>
                      <p className="text-[11px] text-slate-400">{new Date(incident.resolvedAt).toLocaleString()}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{incident.resolutionNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CHAT & COLLABORATION TAB */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full space-y-4">
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {incidentChats.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No collaboration messages yet for this incident.</p>
                  ) : (
                    incidentChats.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-xl border text-xs ${
                          msg.isInternal
                            ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <img src={msg.author.avatar} alt={msg.author.name} className="w-5 h-5 rounded-full object-cover" />
                            <span className="font-bold text-slate-800 dark:text-slate-200">{msg.author.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium">({msg.author.role})</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap">{msg.content}</p>
                        {msg.isInternal && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                            [Internal Note Only]
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Form */}
                <form onSubmit={handleSendComment} className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Post update as: <strong className="text-slate-800 dark:text-slate-200">{currentUser.name}</strong></span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-amber-700 dark:text-amber-400 font-medium text-[11px]">
                      <input
                        type="checkbox"
                        checked={isInternalComment}
                        onChange={(e) => setIsInternalComment(e.target.checked)}
                        className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                      />
                      Internal note
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add an operational update or diagnostic note..."
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resolve Modal */}
      <ResolveIncidentModal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        incident={incident}
      />

      {/* Escalate Modal */}
      <EscalateIncidentModal
        isOpen={escalateModalOpen}
        onClose={() => setEscalateModalOpen(false)}
        incident={incident}
      />
    </>
  );
};
