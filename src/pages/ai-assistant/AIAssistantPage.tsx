import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Incident } from '../../types';
import { SeverityBadge, PriorityBadge, StatusBadge } from '../../components/ui/Badge';
import {
  Sparkles,
  Search,
  Bot,
  Send,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Terminal,
  Cpu,
  Layers,
  Copy,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AIAssistantPage: React.FC = () => {
  const { incidents, knowledgeArticles, addToast } = useApp();

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { role: 'user' | 'assistant'; text: string; timestamp: string }[]
  >([
    {
      role: 'assistant',
      text: 'Hello, I am your Nexus AI Troubleshooting Copilot. Select an active incident or ask me any diagnostic question about system telemetry, memory leaks, database connection pool exhaustion, or card gateway latency.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const activeInc = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory((prev) => [...prev, { role: 'user', text: userText, timestamp: now }]);
    setChatInput('');

    setTimeout(() => {
      let reply = `Based on incident **${activeInc.ticketId}** and historical cluster telemetry:\n\n1. **Root Cause Analysis**: High correlation with ${activeInc.category} on \`${activeInc.impactedEntity}\`.\n2. **Recommended Action**: Follow standard SOP runbook. Terminate hanging worker sessions and re-route incoming traffic to healthy nodes.\n3. **Suggested SLA**: Resolve within ${activeInc.slaMinutes} minutes to avoid executive notification.`;

      if (userText.toLowerCase().includes('sql') || userText.toLowerCase().includes('database')) {
        reply = `**PostgreSQL Diagnostic Advisory**:\nRun \`SELECT pid, state, query FROM pg_stat_activity WHERE state='idle in transaction';\` and check HikariCP connection pool starvation. Terminate rogue sessions older than 5 minutes.`;
      } else if (userText.toLowerCase().includes('timeout') || userText.toLowerCase().includes('paywave')) {
        reply = `**Payment Switch Triage Advisory**:\nInspect HSM cryptographic socket pools on \`paywave-auth-switch-prod-03\`. Thread dumps reveal thread pool exhaustion in worker dispatchers. Drain node traffic via edge proxy.`;
      }

      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('Copied', 'Command copied to clipboard', 'info');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950/70 text-cyan-300 border border-indigo-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI SIMULATION · ZERO EXTERNAL API CALLS
          </span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-400 font-semibold">Automated Root Cause Synthesis & Copilot</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
          AI Incident Assistant & Root Cause Diagnostic Workspace
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Predictive incident summarization, similar historical outage matching, and recommended step-by-step remediation procedures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Incident Selector & AI Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Active Incident for AI Diagnostic
              </label>
              <select
                value={selectedIncidentId}
                onChange={(e) => setSelectedIncidentId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white font-medium focus:outline-hidden focus:border-cyan-500"
              >
                {incidents.slice(0, 15).map((inc) => (
                  <option key={inc.id} value={inc.id}>
                    {inc.ticketId} — {inc.title.slice(0, 45)}... ({inc.severity})
                  </option>
                ))}
              </select>
            </div>

            {/* Incident Context Panel */}
            <div className="p-3.5 rounded-lg bg-[#0a0d18] border border-[#1b233a] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-cyan-400">{activeInc.ticketId}</span>
                <SeverityBadge severity={activeInc.severity} size="sm" />
              </div>
              <h4 className="font-bold text-white leading-tight">{activeInc.title}</h4>
              <p className="text-[11px] text-slate-400">
                <strong className="text-slate-300">Host:</strong> <span className="font-mono text-cyan-300">{activeInc.impactedEntity}</span> · <strong className="text-slate-300">App:</strong> {activeInc.application} ({activeInc.service})
              </p>
            </div>

            {/* AI Synthesized Summary */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-[#0e1427] to-cyan-950/30 border border-indigo-800/60 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wide">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>AI Executive Summary</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The alert indicates a severe degradation in <strong className="text-white">{activeInc.service}</strong> caused by resource exhaustion or external network transit failure. The error symptoms match high concurrent load exceeding thread/connection buffer thresholds.
              </p>

              <div className="pt-2 border-t border-[#1c243b] grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Predicted Root Cause:</span>
                  <strong className="text-white">Socket Buffer / Thread Exhaustion</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Suggested Team:</span>
                  <strong className="text-cyan-400">{activeInc.assignedTeam}</strong>
                </div>
              </div>
            </div>

            {/* Recommended Troubleshooting Steps */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Recommended Troubleshooting Protocol
              </h4>
              <ol className="space-y-2 text-xs text-slate-300">
                <li className="p-2.5 rounded-lg bg-[#0a0d18] border border-[#1b233a] flex items-start gap-2">
                  <span className="font-bold text-cyan-400">1.</span>
                  <span>Inspect active socket states and JVM memory utilization on <code className="text-cyan-300 font-mono text-[11px] bg-[#141b30] px-1 py-0.5 rounded">{activeInc.impactedEntity}</code>.</span>
                </li>
                <li className="p-2.5 rounded-lg bg-[#0a0d18] border border-[#1b233a] flex items-start gap-2">
                  <span className="font-bold text-cyan-400">2.</span>
                  <span>Temporarily drain ingress traffic from this node to healthy cluster replicas.</span>
                </li>
                <li className="p-2.5 rounded-lg bg-[#0a0d18] border border-[#1b233a] flex items-start gap-2">
                  <span className="font-bold text-cyan-400">3.</span>
                  <span>Apply connection pool throttle to prevent cascading upstream starvation.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Right: Interactive AI Troubleshooting Chat (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0e1220] border border-[#1c243b] rounded-xl shadow-xl flex flex-col h-[680px] overflow-hidden">
          <div className="p-4 border-b border-[#1c243b] bg-[#0a0d18] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Interactive Troubleshooting Copilot
                </h3>
                <p className="text-[11px] text-slate-400">Context active: <span className="font-mono text-cyan-400">{activeInc.ticketId}</span></p>
              </div>
            </div>

            <button
              onClick={() =>
                setChatHistory([
                  {
                    role: 'assistant',
                    text: 'Chat history cleared. How can I assist with this incident?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ])
              }
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Chat
            </button>
          </div>

          {/* Chat feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#090c14]">
            {chatHistory.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs max-w-xl ${
                  item.role === 'user'
                    ? 'ml-auto bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-900/30'
                    : 'bg-[#121626] border-[#1f2842] text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1 opacity-80 text-[10px] font-mono">
                  <span>{item.role === 'user' ? 'You' : 'Nexus Copilot'}</span>
                  <span>{item.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">{item.text}</div>
              </div>
            ))}
          </div>

          {/* Suggested Quick Prompts */}
          <div className="p-2.5 bg-[#0a0d18] border-t border-[#1c243b] flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Prompts:</span>
            {[
              'How to troubleshoot connection timeouts?',
              'Show similar past outages',
              'What is the failover command?',
              'Explain root cause',
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => setChatInput(p)}
                className="px-2.5 py-1 rounded bg-[#121626] border border-[#1f2842] text-slate-300 hover:text-cyan-300 hover:bg-[#1a233e] shrink-0 transition-colors text-[11px]"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="p-3 border-t border-[#1c243b] bg-[#0a0d18] flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Copilot about root cause, commands, or SOP runbooks..."
              className="flex-1 px-3 py-2 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-cyan-900/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
