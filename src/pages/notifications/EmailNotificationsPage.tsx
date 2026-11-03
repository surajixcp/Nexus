import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationEmail } from '../../types';
import {
  Mail,
  Send,
  Copy,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  FileText,
  User,
  Inbox,
  ArrowRight,
  Paperclip,
  BookmarkCheck,
  Plus,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export const EmailNotificationsPage: React.FC = () => {
  const {
    emailNotifications,
    applications,
    incidents,
    sendSimulatedEmail,
    addToast,
    currentUser,
  } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Selected email for inspection
  const [selectedEmail, setSelectedEmail] = useState<NotificationEmail>(
    emailNotifications[0] || null
  );

  // Odoo-style Email Composer State
  const [composeType, setComposeType] = useState<NotificationEmail['type']>('Creation');
  const [composeIncidentId, setComposeIncidentId] = useState(incidents[0]?.id || '');
  const [composeRecipients, setComposeRecipients] = useState<string[]>([
    'core-ledger-oncall@example.com',
    'db-alerts@example.com',
  ]);
  const [newRecipientInput, setNewRecipientInput] = useState('');
  const [composeTo, setComposeTo] = useState('banking-ops-leads@example.com');
  const [composeCc, setComposeCc] = useState('incident-commander@example.com, vp-service@example.com');
  const [composeBcc, setComposeBcc] = useState('audit-logging@example.com');
  const [composeSubject, setComposeSubject] = useState(
    '[CRITICAL ALERT] DEMO-INC-0001: PayWave Gateway Merchant Card Authorization Latency'
  );
  const [composeBody, setComposeBody] = useState(
    `Hello Operations Team,\n\nIncident DEMO-INC-0001 has been logged with Severity: Critical (P1).\n\nApplication: PayWave Gateway\nService: Merchant Card Authorization\nImpacted Entity: paywave-auth-switch-prod-03.internal.net\n\nImmediate investigation requested under 60-minute SLA policy. All Tier-2 responders please bridge.`
  );
  const [attachments, setAttachments] = useState<string[]>([
    'Incident_Telemetry_Graph_0001.pdf',
    'ThreadDump_switch03.log',
  ]);

  const filtered = emailNotifications.filter((em) => {
    const matchSearch =
      !search.trim() ||
      em.ticketId.toLowerCase().includes(search.toLowerCase()) ||
      em.subject.toLowerCase().includes(search.toLowerCase()) ||
      em.body.toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === 'All' || em.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleTemplateChange = (type: NotificationEmail['type']) => {
    setComposeType(type);
    const inc = incidents.find((i) => i.id === composeIncidentId) || incidents[0];
    if (!inc) return;

    if (type === 'Creation') {
      setComposeSubject(`[${inc.severity.toUpperCase()} ALERT] ${inc.ticketId}: ${inc.title}`);
      setComposeBody(
        `Hello Operations Stakeholders,\n\nA new incident has been reported by ${currentUser.name}.\n\nTicket ID: ${inc.ticketId}\nApplication: ${inc.application} (${inc.service})\nSeverity: ${inc.severity} (${inc.priority})\nImpacted Entity: ${inc.impactedEntity}\n\nDescription:\n${inc.description}\n\nAssigned SRE: ${inc.assignedTeam}`
      );
    } else if (type === 'Escalation') {
      setComposeSubject(`[ESCALATION - L2] ${inc.ticketId}: ${inc.title}`);
      setComposeBody(
        `Priority Escalation Notice:\n\nIncident ${inc.ticketId} has been escalated to Level 2 Support.\n\nReason: Response SLA approaching breach threshold (> 75% elapsed).\nAssigned Team: ${inc.assignedTeam}\n\nPlease join the incident bridge immediately.`
      );
    } else if (type === 'Update') {
      setComposeSubject(`[OPERATIONAL UPDATE] ${inc.ticketId}: ${inc.title}`);
      setComposeBody(
        `Status update for ${inc.ticketId}:\n\nSupport team is currently draining traffic on the affected cluster node ${inc.impactedEntity}. Latency telemetry is normalizing. ETA to full stabilization: 15 minutes.`
      );
    } else if (type === 'Resolution') {
      setComposeSubject(`[RESOLVED] ${inc.ticketId}: ${inc.title}`);
      setComposeBody(
        `Incident ${inc.ticketId} has been marked as RESOLVED.\n\nRoot Cause: BGP route withdrawal due to transient provider packet loss.\nResolution Steps: Enabled secondary IPSec VPN failover route; verified 100% normal transaction throughput.`
      );
    }
  };

  const handleAddRecipient = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newRecipientInput.trim()) {
      e.preventDefault();
      if (!composeRecipients.includes(newRecipientInput.trim())) {
        setComposeRecipients([...composeRecipients, newRecipientInput.trim()]);
      }
      setNewRecipientInput('');
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setComposeRecipients(composeRecipients.filter((r) => r !== email));
  };

  const handleSendSimulated = (e: React.FormEvent) => {
    e.preventDefault();
    const inc = incidents.find((i) => i.id === composeIncidentId) || incidents[0];
    sendSimulatedEmail({
      incidentId: inc?.id || 'inc-1',
      ticketId: inc?.ticketId || 'DEMO-INC-0001',
      subject: composeSubject,
      to: [...composeRecipients, ...composeTo.split(',').map((s) => s.trim())].filter(Boolean),
      cc: composeCc.split(',').map((s) => s.trim()).filter(Boolean),
      body: composeBody,
      status: 'Sent',
      type: composeType,
    });
  };

  const copyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('Copied', 'Email body copied to clipboard', 'info');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-950/70 text-cyan-300 border border-cyan-800">
            SIMULATED DISPATCH ENGINE · ODOO COMPOSER ARCHITECTURE
          </span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-400 font-semibold">Zero External API / Synthetic In-App Delivery</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
          Enterprise Email Notification Center
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Dynamic application distribution lists, customizable stakeholder email templates, and automated dispatch history.
        </p>
      </div>

      {/* 2-Column Layout: Left Odoo Composer / Right Notification History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Odoo-Style Modal/Card Composer (6.5 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c243b]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Odoo-Inspired Email Dispatch Composer</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/80 text-cyan-300 border border-indigo-800 font-semibold">
                Template Engine Active
              </span>
            </div>

            {/* Template Selector Bar (Odoo Style) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-[#0a0d18] border border-[#1b233a]">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-300">Use Template:</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 flex-1 max-w-md">
                {(['Creation', 'Update', 'Escalation', 'Resolution'] as NotificationEmail['type'][]).map(
                  (type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => handleTemplateChange(type)}
                      className={`py-1 px-2 text-xs font-semibold rounded-md border text-center transition-all ${
                        composeType === type
                          ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-cyan-500 shadow-sm shadow-cyan-900/40'
                          : 'bg-[#121626] border-[#1f2842] text-slate-400 hover:text-white hover:bg-[#181d33]'
                      }`}
                    >
                      {type}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Associated Incident Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Linked Incident Ticket
              </label>
              <select
                value={composeIncidentId}
                onChange={(e) => {
                  setComposeIncidentId(e.target.value);
                  const inc = incidents.find((i) => i.id === e.target.value);
                  if (inc) {
                    setComposeSubject(`[${composeType.toUpperCase()}] ${inc.ticketId}: ${inc.title}`);
                  }
                }}
                className="w-full px-3 py-1.5 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500"
              >
                {incidents.slice(0, 12).map((inc) => (
                  <option key={inc.id} value={inc.id}>
                    {inc.ticketId} — {inc.title.slice(0, 48)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Odoo Style: Followers & Tagged Recipients */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Recipients (Followers of Incident)
              </label>
              <div className="p-2 rounded-lg bg-[#121626] border border-[#1f2842] flex flex-wrap items-center gap-1.5">
                {composeRecipients.map((rec) => (
                  <span
                    key={rec}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono bg-indigo-950/70 border border-indigo-700/60 text-cyan-300"
                  >
                    <span>{rec}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient(rec)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={newRecipientInput}
                  onChange={(e) => setNewRecipientInput(e.target.value)}
                  onKeyDown={handleAddRecipient}
                  placeholder="+ Add recipient email (press Enter)..."
                  className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden min-w-[200px] px-1"
                />
              </div>
            </div>

            {/* Direct TO */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                To (Primary Stakeholder)
              </label>
              <input
                type="text"
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono bg-[#121626] border border-[#1f2842] rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            {/* CC & BCC Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cc (Partners / Leads)
                </label>
                <input
                  type="text"
                  value={composeCc}
                  onChange={(e) => setComposeCc(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-[#121626] border border-[#1f2842] rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bcc (Audit Archive)
                </label>
                <input
                  type="text"
                  value={composeBcc}
                  onChange={(e) => setComposeBcc(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-[#121626] border border-[#1f2842] rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-bold bg-[#121626] border border-[#1f2842] rounded-lg text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            {/* Email Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Formatted Email Message
                </label>
                <button
                  type="button"
                  onClick={() => copyContent(composeBody)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                >
                  <Copy className="w-3 h-3" />
                  Copy Text
                </button>
              </div>
              <textarea
                rows={6}
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                className="w-full p-3 text-xs font-mono bg-[#090c14] border border-[#1f2842] rounded-lg text-slate-200 focus:outline-hidden focus:border-cyan-500 leading-relaxed"
              />
            </div>

            {/* Attachments Section (Odoo Style) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Attachments
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {attachments.map((att) => (
                  <div
                    key={att}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141b30] border border-[#232e4d] text-xs font-mono text-cyan-300"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{att}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const sampleName = `Cluster_Diagnostic_${Date.now().toString().slice(-4)}.json`;
                    setAttachments([...attachments, sampleName]);
                    addToast('Attachment Added', `Attached ${sampleName}`, 'info');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121626] hover:bg-[#1a233e] border border-[#1f2842] text-xs text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attach a file</span>
                </button>
              </div>
            </div>

            {/* Send & Action Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-[#1c243b]">
              <button
                type="button"
                onClick={() => {
                  addToast('Template Saved', 'Current draft saved to custom enterprise templates', 'success');
                }}
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 font-medium transition-colors"
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Save as new template</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleTemplateChange('Creation');
                    addToast('Reset', 'Draft reset to creation template', 'info');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-[#121626] rounded-lg transition-colors border border-[#1f2842]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendSimulated}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-lg shadow-md shadow-cyan-900/30 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Broadcast</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Email History & Selected Inspection (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-[#1c243b]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                <Inbox className="w-4 h-4 text-cyan-400" />
                <span>Dispatched Logs ({filtered.length})</span>
              </div>

              <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-2.5 py-1 bg-[#121626] border border-[#1f2842] rounded-md text-slate-200 text-xs focus:outline-hidden"
                >
                  <option value="All">All Types</option>
                  <option value="Creation">Creation</option>
                  <option value="Escalation">Escalation</option>
                  <option value="Update">Update</option>
                  <option value="Resolution">Resolution</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedEmail(item)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedEmail?.id === item.id
                      ? 'border-cyan-500 bg-cyan-950/20 ring-1 ring-cyan-500/30'
                      : 'border-[#1b233a] bg-[#121626] hover:bg-[#181d33]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-400">
                        {item.ticketId}
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#161c2e] text-indigo-300 border border-[#232e4d]">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h5 className="font-semibold text-slate-200 line-clamp-1 mb-1">
                    {item.subject}
                  </h5>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[180px]">To: {item.to.join(', ')}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Email Detailed Preview */}
            {selectedEmail && (
              <div className="p-4 rounded-xl bg-[#0a0d18] border border-[#1c243b] space-y-3">
                <div className="flex items-center justify-between border-b border-[#1c243b] pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Dispatched Payload Preview
                  </h4>
                  <button
                    onClick={() => copyContent(selectedEmail.body)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Payload
                  </button>
                </div>

                <div className="text-xs space-y-1">
                  <p className="text-slate-400">
                    <strong className="text-slate-300">TO:</strong>{' '}
                    <span className="font-mono text-cyan-400">{selectedEmail.to.join(', ')}</span>
                  </p>
                  <p className="text-slate-400">
                    <strong className="text-slate-300">CC:</strong>{' '}
                    <span className="font-mono text-slate-400">{selectedEmail.cc.join(', ')}</span>
                  </p>
                  <p className="text-slate-400">
                    <strong className="text-slate-300">SUBJECT:</strong>{' '}
                    <span className="font-bold text-white">{selectedEmail.subject}</span>
                  </p>
                  <p className="text-slate-400">
                    <strong className="text-slate-300">SENT AT:</strong>{' '}
                    <span className="text-slate-400">{new Date(selectedEmail.sentAt).toLocaleString()}</span>
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#090c14] border border-[#1b233a] text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto">
                  {selectedEmail.body}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
