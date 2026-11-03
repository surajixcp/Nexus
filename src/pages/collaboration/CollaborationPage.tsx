import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessagesSquare,
  Send,
  Paperclip,
  Search,
  Lock,
  Globe,
  Radio,
  Sparkles,
  PhoneCall,
  Flame,
  ShieldAlert,
  Hash,
  Users,
  Clock,
  Terminal,
  Mic,
  MicOff,
  Mail,
  Copy,
  Check,
  FileText,
  X,
  Volume2,
  Share2,
  AlertTriangle,
  Play,
  RotateCw,
  ExternalLink,
  Cpu,
  Database,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { StatusBadge, SeverityBadge, PriorityBadge } from '../../components/ui/Badge';

export const CollaborationPage: React.FC = () => {
  const { incidents, chatMessages, addChatMessage, currentUser, addToast, sendSimulatedEmail } = useApp();

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [messageText, setMessageText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [channelSearch, setChannelSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<'all' | 'p1' | 'active'>('all');
  
  // Audio Bridge state
  const [voiceBridgeActive, setVoiceBridgeActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Email Notification Modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState('p1_briefing');
  const [emailRecipients, setEmailRecipients] = useState<string[]>([
    'Core SRE Leads',
    'Executive Incident Management',
    'Application Owner',
  ]);
  const [emailTo, setEmailTo] = useState('incident-response@company.internal');
  const [emailCc, setEmailCc] = useState('sre-leads@company.internal, vp-engineering@company.internal');
  const [emailBcc, setEmailBcc] = useState('audit-logging@company.internal');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [attachmentName, setAttachmentName] = useState('INC_Diagnostic_Summary.pdf');
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const activeIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];
  const rawMessagesForIncident = chatMessages.filter((m) => m.incidentId === activeIncident?.id);

  // If this channel has no user messages yet, generate realistic synthetic initial briefing so it's never an empty void
  const messagesForIncident = rawMessagesForIncident.length > 0
    ? rawMessagesForIncident
    : [
        {
          id: `init-bot-${activeIncident?.id || 'default'}`,
          incidentId: activeIncident?.id || 'default',
          author: {
            name: 'Nexus Incident Bot',
            role: 'Automated Dispatcher',
            avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&q=80',
            email: 'bot@nexus.internal',
          },
          content: `🤖 [WAR CHANNEL CREATED]: Emergency bridge provisioned for ${activeIncident?.ticketId || 'INCIDENT'}.\n` +
            `• Severity: ${activeIncident?.severity || 'High'} (${activeIncident?.priority || 'P2'})\n` +
            `• Impacted Service: ${activeIncident?.application || 'Core Service'}\n` +
            `• Target Entity: ${activeIncident?.impactedEntity || 'Cluster Pod'}\n` +
            `• Assigned Squad: ${activeIncident?.assignedTeam || 'Platform SRE'}\n` +
            `• SLA Countdown Budget: ${activeIncident?.slaMinutes || 60} minutes\n\n` +
            `On-call responders have been paged. Use diagnostic actions above to trigger live telemetry probes.`,
          timestamp: activeIncident?.reportedAt || new Date().toISOString(),
          isInternal: false,
        },
      ];

  // Open Email Modal with prefilled values
  const handleOpenEmailModal = () => {
    if (!activeIncident) return;
    setEmailSubject(`[INCIDENT ALERT] ${activeIncident.ticketId}: ${activeIncident.title} (${activeIncident.severity})`);
    setEmailBody(
      `Hello Incident Stakeholders,\n\n` +
      `Incident ${activeIncident.ticketId} affecting ${activeIncident.application} has been declared as ${activeIncident.severity} priority.\n\n` +
      `Current Status: ${activeIncident.status}\n` +
      `Impacted Entity: ${activeIncident.impactedEntity}\n` +
      `Assigned SRE Squad: ${activeIncident.assignedTeam}\n\n` +
      `Operational Findings:\n` +
      `${activeIncident.description}\n\n` +
      `Live War Room Channel: #${activeIncident.ticketId}\n` +
      `Next Executive Briefing: 30 minutes.\n\n` +
      `Nexus Incident Command System`
    );
    setAttachmentName(`${activeIncident.ticketId}_Incident_Packet.pdf`);
    setIsEmailModalOpen(true);
  };

  const handleTemplateChange = (templateKey: string) => {
    setEmailTemplate(templateKey);
    if (!activeIncident) return;
    if (templateKey === 'p1_briefing') {
      setEmailSubject(`[URGENT P1 UPDATE] ${activeIncident.ticketId}: ${activeIncident.title}`);
      setEmailBody(
        `Executive Incident Briefing\n\n` +
        `Ticket ID: ${activeIncident.ticketId}\n` +
        `Service: ${activeIncident.application} (${activeIncident.impactedEntity})\n` +
        `Severity: ${activeIncident.severity} (Active War Room Dispatched)\n\n` +
        `Incident Commander: Alex Morgan (Platform SRE)\n` +
        `Mitigation Progress: Root cause isolation in progress. Telemetry drain initiated.\n\n` +
        `Best regards,\nIncident Response Bridge`
      );
    } else if (templateKey === 'handover') {
      setEmailSubject(`[SHIFT HANDOVER] ${activeIncident.ticketId}: Operational State Briefing`);
      setEmailBody(
        `SRE Shift Handover Report\n\n` +
        `Active Ticket: ${activeIncident.ticketId} - ${activeIncident.title}\n` +
        `Pending Tasks: Review slow query log indexation; monitor pod CPU threshold.\n` +
        `On-call Primary Transition: Alex Morgan -> Elena Rostova (APEC Shift)\n\n` +
        `Nexus War Room`
      );
    } else if (templateKey === 'customer_advisory') {
      setEmailSubject(`[SERVICE ADVISORY] Partial Degradation affecting ${activeIncident.application}`);
      setEmailBody(
        `Dear Valued Customers and Partners,\n\n` +
        `Our engineering team is currently investigating an unexpected performance degradation affecting ${activeIncident.application}.\n` +
        `Core transactions remain functional with potential latency. We are actively mitigating the issue.\n\n` +
        `Thank you for your trust and patience.\n` +
        `Nexus Customer Reliability Team`
      );
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeIncident) return;
    sendSimulatedEmail({
      incidentId: activeIncident.id,
      ticketId: activeIncident.ticketId,
      subject: emailSubject,
      to: emailTo.split(',').map((s) => s.trim()).filter(Boolean),
      cc: emailCc.split(',').map((s) => s.trim()).filter(Boolean),
      body: emailBody,
      status: 'Sent',
      type: activeIncident.severity === 'Critical' ? 'Escalation' : 'Update',
    });
    addToast('Advisory Dispatched', `Broadcast email sent to ${emailTo}`, 'success');
    setIsEmailModalOpen(false);
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (channelFilter === 'p1' && inc.severity !== 'Critical') return false;
    if (channelFilter === 'active' && inc.status === 'Resolved') return false;
    if (!channelSearch.trim()) return true;
    const q = channelSearch.toLowerCase();
    return (
      inc.ticketId.toLowerCase().includes(q) ||
      inc.title.toLowerCase().includes(q) ||
      inc.application.toLowerCase().includes(q)
    );
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeIncident) return;
    addChatMessage(activeIncident.id, messageText, isInternal);
    setMessageText('');
  };

  // Trigger SRE Bot diagnostic action
  const handleTriggerBotDiagnostic = (type: 'health' | 'db' | 'rollback') => {
    if (!activeIncident) return;
    let botMsg = '';
    if (type === 'health') {
      botMsg = `🤖 [SRE-BOT HEALTH CHECK]: Probe completed on cluster ${activeIncident.impactedEntity}.\n` +
        `• Pods 12/12 online · Ingress routing healthy\n• Error rate: 3.4% (Threshold < 0.1%)\n• P99 Latency: 1,240ms (High alert)\n• Recommended action: Increase replica pool size +50%.`;
    } else if (type === 'db') {
      botMsg = `🤖 [DBA-BOT TELEMETRY]: Slow query telemetry captured.\n` +
        `• Top blocker: SELECT * FROM transactions WHERE account_id = ? LOCK IN SHARE MODE\n• Active connections: 94% of max_connections\n• Deadlock count: 14 occurrences in last 10m.\n• Recommended action: Terminate idle pool connections older than 5m.`;
    } else {
      botMsg = `🤖 [AUTOMATION BOT]: Rollback canary analysis prepared for ${activeIncident.application}.\n` +
        `• Target image: v2.14.8-hotfix -> v2.14.7-stable\n• Estimated drain duration: 35 seconds\n• Health status: Standby for Lead SRE confirmation.`;
    }
    addChatMessage(activeIncident.id, botMsg, true);
    addToast('Diagnostic Bot Triggered', 'Automated telemetry posted to channel', 'info');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
    addToast('Copied', 'Snippet copied to clipboard', 'info');
  };

  // On-call engineers directory
  const onlineEngineers = [
    {
      name: 'Alex Morgan',
      role: 'Incident Commander',
      team: 'Platform SRE',
      status: 'In War Room Bridge',
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'Priya Sharma',
      role: 'Staff DB Engineer',
      team: 'Data Services',
      status: 'Analyzing Query Plans',
      phone: '+1 (555) 019-8871',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'SRE Lead',
      team: 'Core Gateway',
      status: 'Monitoring Cluster',
      phone: '+1 (555) 019-4412',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'Marcus Vance',
      role: 'VP Service Delivery',
      team: 'Leadership',
      status: 'Executive Monitor',
      phone: '+1 (555) 019-9905',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden p-3.5 sm:p-5 gap-3.5 text-slate-100 max-w-[1700px] mx-auto w-full">
      {/* Pinned Top Bar: Sleek, Compact War Room Cockpit Header */}
      <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#0c101d] border border-[#1b233a] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950/80 text-cyan-300 border border-indigo-700 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              TECHPULSE SRE WAR ROOM
            </span>
          </div>

          <span className="hidden sm:inline text-xs text-slate-600">|</span>

          {activeIncident && (
            <div className="flex items-center gap-2 truncate">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                #{activeIncident.ticketId}
              </span>
              <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                {activeIncident.title}
              </span>
            </div>
          )}
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenEmailModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#141b30] hover:bg-[#1a233e] text-cyan-300 border border-[#232e4d] shadow-sm transition-all hover:border-cyan-500/50"
          >
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>Broadcast Advisory</span>
          </button>

          <button
            onClick={() => {
              const newState = !voiceBridgeActive;
              setVoiceBridgeActive(newState);
              addToast(
                newState ? 'Emergency Bridge Joined' : 'Bridge Disconnected',
                newState ? 'Connected to live SRE Audio Bridge with 4 responders' : 'Disconnected from war room audio channel',
                newState ? 'success' : 'info'
              );
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              voiceBridgeActive
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/40 animate-pulse'
                : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-cyan-900/30'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{voiceBridgeActive ? 'Disconnect Bridge' : 'Join Audio Bridge'}</span>
          </button>
        </div>
      </div>

      {/* 3-Pane Responsive Layout (Never causes outer scroll; each pane scrolls internally) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch overflow-hidden">
        
        {/* Pane 1 (Left): Channels List (3 cols out of 12) */}
        <div className="lg:col-span-3 h-full flex flex-col bg-[#0e1220] border border-[#1c243b] rounded-2xl shadow-xl overflow-hidden">
          {/* Channel Header & Filter Tabs */}
          <div className="shrink-0 p-3.5 border-b border-[#1c243b] bg-[#090c14] space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                Active War Channels
              </h2>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#161c2e] text-cyan-400 border border-[#232e4d]">
                {filteredIncidents.length}
              </span>
            </div>

            {/* Slicer Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-[#121626] p-1 rounded-xl border border-[#1f2842] text-[10px] font-semibold text-center">
              <button
                onClick={() => setChannelFilter('all')}
                className={`py-1 rounded-lg transition-all ${
                  channelFilter === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setChannelFilter('p1')}
                className={`py-1 rounded-lg transition-all ${
                  channelFilter === 'p1'
                    ? 'bg-rose-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                P1 Only
              </button>
              <button
                onClick={() => setChannelFilter('active')}
                className={`py-1 rounded-lg transition-all ${
                  channelFilter === 'active'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Open
              </button>
            </div>

            {/* Channel Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={channelSearch}
                onChange={(e) => setChannelSearch(e.target.value)}
                placeholder="Filter channels..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#121626] border border-[#1f2842] rounded-xl text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Scrollable Channels List */}
          <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1.5">
            {filteredIncidents.map((inc) => {
              const isSelected = inc.id === selectedIncidentId;
              const chatCount = chatMessages.filter((m) => m.incidentId === inc.id).length;

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-indigo-950/70 border-indigo-500/80 shadow-md shadow-indigo-950/50'
                      : 'hover:bg-[#121626] border-[#182035] bg-[#0c101c]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1">
                      <Hash className="w-3 h-3 text-cyan-500" />
                      {inc.ticketId}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded bg-[#161c2e] border border-[#232e4d]">
                      {chatCount || 1} msgs
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1.5">
                    {inc.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[120px] font-mono text-[10px] text-slate-400">
                      {inc.application}
                    </span>
                    <SeverityBadge severity={inc.severity} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pinned Bottom Bar: Audio Bridge Shortcut */}
          <div className="shrink-0 p-3 border-t border-[#1c243b] bg-[#090c14] flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${voiceBridgeActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              Bridge Status:
            </span>
            <span className={voiceBridgeActive ? 'text-emerald-300 font-bold' : 'text-slate-500 font-mono'}>
              {voiceBridgeActive ? 'LIVE (4 Active)' : 'Standby'}
            </span>
          </div>
        </div>

        {/* Pane 2 (Center): Active Incident Chat & Live Diagnostics (6 cols out of 12) */}
        <div className="lg:col-span-6 h-full flex flex-col bg-[#0e1220] border border-[#1c243b] rounded-2xl shadow-xl overflow-hidden">
          {/* Pinned War Room Channel Header */}
          {activeIncident && (
            <div className="shrink-0 p-3.5 border-b border-[#1c243b] bg-[#090c14] space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                      #{activeIncident.ticketId}
                    </span>
                    <h2 className="text-sm font-bold text-white line-clamp-1">
                      {activeIncident.title}
                    </h2>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Service: <strong className="text-white">{activeIncident.application}</strong> &middot; Target:{' '}
                    <span className="font-mono text-indigo-300">{activeIncident.impactedEntity}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <SeverityBadge severity={activeIncident.severity} size="sm" />
                  <StatusBadge status={activeIncident.status} />
                </div>
              </div>

              {/* Live Audio Bridge Bar if connected */}
              {voiceBridgeActive && (
                <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-indigo-950/40 border border-emerald-500/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="w-1.5 h-4 bg-emerald-300 rounded-full animate-bounce" />
                      <span className="w-1.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                    </div>
                    <div>
                      <p className="font-bold text-white flex items-center gap-1.5 text-xs">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        War Room Live Audio Bridge Connected
                      </p>
                      <p className="text-[10px] text-emerald-300/80">
                        Speaking: Alex Morgan (SRE Lead) &middot; 4 Participants
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        isMuted ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-[#141b30] text-cyan-300 border border-[#232e4d]'
                      }`}
                    >
                      {isMuted ? <MicOff className="w-3 h-3 text-amber-400" /> : <Mic className="w-3 h-3 text-cyan-400" />}
                      <span className="text-[10px]">{isMuted ? 'Muted' : 'Mute'}</span>
                    </button>
                    <button
                      onClick={() => setVoiceBridgeActive(false)}
                      className="px-2 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-[10px] font-bold"
                    >
                      Leave
                    </button>
                  </div>
                </div>
              )}

              {/* Bot Diagnostic Action Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Bot Probes:
                </span>
                <button
                  onClick={() => handleTriggerBotDiagnostic('health')}
                  className="px-2 py-0.5 rounded-md bg-[#141b30] hover:bg-[#1a233e] text-cyan-300 border border-[#232e4d] hover:border-cyan-500 text-[10.5px] font-mono flex items-center gap-1 transition-colors"
                >
                  <Cpu className="w-2.5 h-2.5 text-cyan-400" />
                  Run Pod Health Probe
                </button>
                <button
                  onClick={() => handleTriggerBotDiagnostic('db')}
                  className="px-2 py-0.5 rounded-md bg-[#141b30] hover:bg-[#1a233e] text-indigo-300 border border-[#232e4d] hover:border-indigo-500 text-[10.5px] font-mono flex items-center gap-1 transition-colors"
                >
                  <Database className="w-2.5 h-2.5 text-indigo-400" />
                  Fetch DB Slow Queries
                </button>
                <button
                  onClick={() => handleTriggerBotDiagnostic('rollback')}
                  className="px-2 py-0.5 rounded-md bg-[#141b30] hover:bg-[#1a233e] text-amber-300 border border-[#232e4d] hover:border-amber-500 text-[10.5px] font-mono flex items-center gap-1 transition-colors"
                >
                  <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                  Canary Rollback Check
                </button>
              </div>
            </div>
          )}

          {/* Scrollable Messages Thread Feed */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-3 bg-[#07090f]">
            {messagesForIncident.map((msg) => {
              const isOwn = msg.author.name === currentUser.name;
              const isBot = msg.author.name.toLowerCase().includes('bot') || msg.author.role.toLowerCase().includes('bot') || msg.content.startsWith('🤖');
              
              return (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    msg.isInternal
                      ? 'bg-amber-950/20 border-amber-800/40 text-amber-200/95'
                      : isBot
                      ? 'bg-cyan-950/20 border-cyan-800/40 text-cyan-200/95'
                      : isOwn
                      ? 'bg-indigo-950/30 border-indigo-700/50 text-slate-200'
                      : 'bg-[#121626] border-[#1f2842] text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={msg.author.avatar}
                        alt={msg.author.name}
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <span className="font-bold text-white">{msg.author.name}</span>
                      <span className="text-[10px] text-slate-400">({msg.author.role})</span>

                      {msg.isInternal ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800/60">
                          <Lock className="w-2.5 h-2.5 text-amber-400" />
                          INTERNAL NOTE
                        </span>
                      ) : isBot ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 font-mono">
                          <Terminal className="w-2.5 h-2.5 text-cyan-400" />
                          TELEMETRY BOT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-300 px-1.5 py-0.5 rounded bg-[#1a2138] border border-[#273254]">
                          <Globe className="w-2.5 h-2.5 text-cyan-400" />
                          BROADCAST
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed text-slate-200 font-sans">
                    {msg.content}
                  </div>

                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-[#1c243b] flex items-center gap-2">
                      <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                      {msg.attachments.map((att, i) => (
                        <span
                          key={i}
                          className="font-mono text-[11px] text-cyan-300 bg-[#161c2e] px-2 py-0.5 rounded border border-[#232e4d] hover:border-cyan-500 cursor-pointer flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-cyan-400" />
                          {att}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pinned Bottom Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="shrink-0 p-3.5 border-t border-[#1c243b] bg-[#090c14] space-y-2.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Logged in as: <strong className="text-cyan-300">{currentUser.name}</strong> ({currentUser.role})
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer text-amber-400 font-semibold text-xs select-none">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="rounded border-amber-500 bg-[#121626] text-amber-500 focus:ring-amber-500"
                />
                Mark as Internal Confidential Note
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={
                  isInternal
                    ? 'Post internal diagnostic finding or sensitive root cause note...'
                    : 'Post operational update to stakeholders and SRE channel...'
                }
                className="flex-1 px-3.5 py-2 text-xs bg-[#121626] border border-[#1f2842] rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-cyan-900/30 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>

        {/* Pane 3 (Right): On-Call Directory & Incident Diagnostics (3 cols out of 12) */}
        <div className="lg:col-span-3 h-full flex flex-col bg-[#0e1220] border border-[#1c243b] rounded-2xl shadow-xl overflow-hidden">
          {/* Pinned Header */}
          <div className="shrink-0 p-3.5 border-b border-[#1c243b] bg-[#090c14] flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              On-Call Responders
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800">
              4 Online
            </span>
          </div>

          {/* Scrollable Responders Directory & Runbook Snippets */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-3">
            {/* Engineer Cards */}
            {onlineEngineers.map((eng) => (
              <div
                key={eng.name}
                className="p-3 rounded-xl bg-[#121626] border border-[#1f2842] hover:border-[#2a3759] transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative shrink-0">
                      <img
                        src={eng.avatar}
                        alt={eng.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0e1220]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{eng.name}</h4>
                      <p className="text-[10px] text-slate-400">{eng.role}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161c2e] text-indigo-300 border border-[#232e4d]">
                    {eng.team}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#1a2238]">
                  <span className="text-emerald-400 font-medium text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {eng.status}
                  </span>

                  {/* Contact Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => addToast('Paging Engineer', `PagerDuty high-urgency alert sent to ${eng.name}`, 'info')}
                      className="px-2 py-0.5 rounded text-[10px] bg-[#182035] hover:bg-[#202b48] text-cyan-300 border border-[#263456]"
                      title="Page on PagerDuty"
                    >
                      Page
                    </button>
                    <button
                      onClick={() => addToast('Dialing Bridge', `Calling phone line for ${eng.name}: ${eng.phone}`, 'info')}
                      className="px-2 py-0.5 rounded text-[10px] bg-[#182035] hover:bg-[#202b48] text-indigo-300 border border-[#263456]"
                      title={`Call ${eng.phone}`}
                    >
                      Call
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Runbook Diagnostics Code Snippet */}
            <div className="p-3 rounded-xl bg-[#141b30] border border-[#232e4d] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Quick Telemetry Runbook
                </span>
                <button
                  onClick={() => copyToClipboard(`nexus-cli drain --target ${activeIncident.impactedEntity} --grace=30s`, 'cmd1')}
                  className="text-slate-400 hover:text-cyan-300 p-1"
                  title="Copy command"
                >
                  {copiedSnippet === 'cmd1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                Execute automated pod traffic drain to isolate faulty nodes:
              </p>

              <code className="block p-2 rounded-lg bg-[#090c14] border border-[#1b233a] text-[10.5px] font-mono text-cyan-300 break-all select-all">
                $ nexus-cli drain --target {activeIncident.impactedEntity} --grace=30s
              </code>
            </div>

            {/* Kubernetes Deployment Status Check Snippet */}
            <div className="p-3 rounded-xl bg-[#141b30] border border-[#232e4d] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Cluster Pod Telemetry
                </span>
                <button
                  onClick={() => copyToClipboard(`kubectl get pods -l app=${activeIncident.application.toLowerCase().replace(/ /g, '-')} -n prod`, 'cmd2')}
                  className="text-slate-400 hover:text-indigo-300 p-1"
                  title="Copy command"
                >
                  {copiedSnippet === 'cmd2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <code className="block p-2 rounded-lg bg-[#090c14] border border-[#1b233a] text-[10px] font-mono text-indigo-300 break-all select-all">
                $ kubectl get pods -l app={activeIncident.application.toLowerCase().replace(/ /g, '-')} -n prod
              </code>
            </div>

            {/* Active Incident Key Parameters */}
            <div className="p-3 rounded-xl bg-[#101424] border border-[#1f2842] space-y-1.5 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Incident Telemetry Summary
              </p>
              <div className="flex justify-between py-1 border-b border-[#182035] text-[11px]">
                <span className="text-slate-400">SLA Budget:</span>
                <span className="font-mono font-bold text-cyan-300">{activeIncident.slaMinutes} mins</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#182035] text-[11px]">
                <span className="text-slate-400">Impacted Entity:</span>
                <span className="font-mono text-indigo-300 truncate max-w-[130px]">{activeIncident.impactedEntity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#182035] text-[11px]">
                <span className="text-slate-400">Lead Assignee:</span>
                <span className="text-white font-medium">{activeIncident.assignee || 'On-Call Pool'}</span>
              </div>
              <div className="flex justify-between py-1 text-[11px]">
                <span className="text-slate-400">Environment:</span>
                <span className="font-mono text-emerald-300">{activeIncident.environment || 'Production'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stakeholder Email Notification / Dispatcher Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0e1220] border border-[#1c243b] rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#1c243b] bg-[#090c14] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Broadcast Stakeholder Advisory</h3>
                  <p className="text-xs text-slate-400">Enterprise Email Notification Dispatcher &middot; Simulated Transport</p>
                </div>
              </div>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2138] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSendEmail} className="p-5 space-y-4 text-xs">
              {/* Recipients Pill Box */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Recipients (Followers of incident and operational list)
                </label>
                <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-[#121626] border border-[#1f2842]">
                  {emailRecipients.map((rec, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700/60 text-cyan-300 text-xs font-semibold"
                    >
                      <span>{rec}</span>
                      <button
                        type="button"
                        onClick={() => setEmailRecipients(emailRecipients.filter((_, idx) => idx !== i))}
                        className="hover:text-rose-400 ml-0.5"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add contacts to notify..."
                    className="flex-1 min-w-[140px] bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden px-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        e.preventDefault();
                        setEmailRecipients([...emailRecipients, e.currentTarget.value.trim()]);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>

              {/* To, Cc, Bcc Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">To</label>
                  <input
                    type="text"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#121626] border border-[#1f2842] text-xs text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Cc (Partners)</label>
                  <input
                    type="text"
                    value={emailCc}
                    onChange={(e) => setEmailCc(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#121626] border border-[#1f2842] text-xs text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Bcc (Partners)</label>
                  <input
                    type="text"
                    value={emailBcc}
                    onChange={(e) => setEmailBcc(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#121626] border border-[#1f2842] text-xs text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#121626] border border-indigo-500/40 text-xs text-white font-medium focus:outline-hidden focus:border-indigo-400"
                />
              </div>

              {/* Email Content Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-400">Message Content</label>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Use template:</span>
                    <select
                      value={emailTemplate}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="px-2 py-0.5 text-[11px] bg-[#121626] border border-[#1f2842] rounded-lg text-cyan-300 focus:outline-hidden"
                    >
                      <option value="p1_briefing">P1 Major Incident Executive Briefing</option>
                      <option value="handover">SRE Shift Handover Status</option>
                      <option value="customer_advisory">Customer Facing Service Advisory</option>
                    </select>
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#121626] border border-[#1f2842] text-xs text-slate-200 font-mono leading-relaxed focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              {/* Attachment Pill */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#121626] border border-[#1f2842]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{attachmentName}</span>
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">PDF Document &middot; 248 KB &middot; Generated Telemetry</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addToast('File Attached', 'Diagnostic telemetry bundle attached', 'info');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182035] hover:bg-[#202b48] text-xs text-slate-300 border border-[#273456]"
                >
                  <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Attach another file</span>
                </button>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#1c243b]">
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAsTemplate}
                    onChange={(e) => setSaveAsTemplate(e.target.checked)}
                    className="rounded border-[#1f2842] bg-[#121626] text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Save as new reusable notification template</span>
                </label>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEmailModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#121626] hover:bg-[#1a2138] border border-[#1f2842] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-950/60 transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Advisory</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
