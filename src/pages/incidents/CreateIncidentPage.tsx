import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Severity, Priority, Environment } from '../../types';
import { getPriorityFromSeverity, formatTicketId } from '../../utils/calculations';
import { Modal } from '../../components/ui/Modal';
import {
  PlusCircle,
  Mail,
  ShieldAlert,
  Server,
  Upload,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';

export const CreateIncidentPage: React.FC = () => {
  const { applications, currentUser, incidents, createIncident } = useApp();
  const navigate = useNavigate();

  // Generated Ticket ID
  const nextTicketId = formatTicketId(incidents.length + 1);

  // Form State
  const [title, setTitle] = useState('');
  const [application, setApplication] = useState(applications[0]?.name || 'DemoBank Core');
  const [service, setService] = useState(applications[0]?.services[0]?.name || 'Account Ledger Engine');
  const [category, setCategory] = useState('Application Availability');
  const [severity, setSeverity] = useState<Severity>('High');
  const [priority, setPriority] = useState<Priority>('P2');
  const [environment, setEnvironment] = useState<Environment>('Production');
  const [impactedEntity, setImpactedEntity] = useState('prod-ledger-cluster-01.internal');
  const [impact, setImpact] = useState('Tier 1 customer transaction postings experiencing degradation.');
  const [urgency, setUrgency] = useState('High - Prime business operation hours.');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<string[]>(['error_stack_trace.log']);

  // Dynamic Support Team and Email Recipients
  const currentApp = applications.find((a) => a.name === application) || applications[0];
  const currentService = currentApp.services.find((s) => s.name === service) || currentApp.services[0];
  const assignedTeam = currentService.supportTeam;
  const toRecipients = currentService.defaultToRecipients;
  const ccRecipients = currentService.defaultCcRecipients;

  // Confirmation Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Auto-update priority when severity changes
  useEffect(() => {
    setPriority(getPriorityFromSeverity(severity));
  }, [severity]);

  // When application changes, default to its first service
  const handleAppChange = (appName: string) => {
    setApplication(appName);
    const selected = applications.find((a) => a.name === appName);
    if (selected && selected.services.length > 0) {
      setService(selected.services[0].name);
    }
  };

  const handleSimulatedFileUpload = () => {
    const filename = `telemetry_dump_${Date.now().toString().slice(-4)}.log`;
    setAttachments((prev) => [...prev, filename]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setShowConfirmModal(true);
  };

  const confirmCreation = () => {
    const newInc = createIncident({
      title,
      application,
      service,
      category,
      severity,
      priority,
      environment,
      impactedEntity,
      impact,
      urgency,
      description,
      attachments,
      assignedTeam,
    });
    setShowConfirmModal(false);
    navigate(`/incidents?id=${newInc.id}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            AUTO-ID: {nextTicketId}
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            Operational Intake
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Create Incident & Dispatch Alert
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Report technical disruptions, auto-calculate SLA timers, and trigger automated support team routing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Incident Overview
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Incident Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., PayWave Gateway High Latency > 8000ms and Timeout Spike on Switch 03"
                className="w-full px-3.5 py-2.5 text-xs bg-[#121626] border border-[#1f2842] rounded-xl focus:outline-hidden focus:border-cyan-500 text-white placeholder-slate-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Application <span className="text-rose-500">*</span>
                </label>
                <select
                  value={application}
                  onChange={(e) => handleAppChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#121626] border border-[#1f2842] rounded-xl text-white focus:outline-hidden focus:border-cyan-500"
                >
                  {applications.map((app) => (
                    <option key={app.id} value={app.name}>
                      {app.name} ({app.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Service / Sub-Component <span className="text-rose-500">*</span>
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#121626] border border-[#1f2842] rounded-xl text-white focus:outline-hidden focus:border-cyan-500"
                >
                  {currentApp.services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Severity <span className="text-rose-500">*</span>
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as Severity)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#121626] border border-[#1f2842] rounded-xl font-semibold text-rose-400 focus:outline-hidden focus:border-rose-500"
                >
                  <option value="Critical">Critical (P1 - 60m SLA)</option>
                  <option value="High">High (P2 - 240m SLA)</option>
                  <option value="Medium">Medium (P3 - 720m SLA)</option>
                  <option value="Low">Low (P4 - 1440m SLA)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Calculated Priority
                </label>
                <input
                  type="text"
                  readOnly
                  value={priority}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#161c2e] border border-[#232c46] rounded-xl font-bold font-mono text-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Environment
                </label>
                <select
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value as Environment)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#121626] border border-[#1f2842] rounded-xl text-white focus:outline-hidden focus:border-cyan-500"
                >
                  <option value="Production">Production</option>
                  <option value="UAT">UAT</option>
                  <option value="Development">Development</option>
                </select>
              </div>
            </div>
          </div>

          {/* Impact & Scope */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Technical Impact & Scope
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Impacted Entity / Hostname / Microservice <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={impactedEntity}
                onChange={(e) => setImpactedEntity(e.target.value)}
                placeholder="e.g., paywave-switch-03.internal or postgres-master-01"
                className="w-full px-3.5 py-2.5 text-xs bg-[#121626] border border-[#1f2842] rounded-xl font-mono text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business Impact
                </label>
                <input
                  type="text"
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#121626] border border-[#1f2842] rounded-xl text-white focus:outline-hidden focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Urgency Rationale
                </label>
                <input
                  type="text"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#121626] border border-[#1f2842] rounded-xl text-white focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Incident Description & Logs <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Paste relevant error messages, HTTP response codes, latency metrics, and symptoms observed..."
                className="w-full px-3.5 py-2.5 text-xs bg-[#121626] border border-[#1f2842] rounded-xl font-mono text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            {/* Attachments Simulation */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Attachments & Log Captures
                </label>
                <button
                  type="button"
                  onClick={handleSimulatedFileUpload}
                  className="text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  + Attach File / Log Dump
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg bg-[#121626] text-cyan-300 border border-[#1f2842]"
                  >
                    {file}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/incidents')}
              className="px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-[#121626] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-xl shadow-lg shadow-indigo-950/50 transition-all hover:scale-[1.01]"
            >
              <PlusCircle className="w-4 h-4" />
              Submit Incident & Dispatch Alert
            </button>
          </div>
        </form>

        {/* Right 1 Col: Smart Dynamic Routing & Email Preview Panel */}
        <div className="space-y-4">
          {/* Smart Team Assignment Card */}
          <div className="p-5 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Smart Support Assignment</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0a0d18] border border-[#1a2238] text-xs">
              <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-0.5">
                Automatically Assigned Support Team
              </span>
              <p className="font-bold text-white text-sm">{assignedTeam}</p>
              <span className="text-[11px] text-slate-400 block mt-1">
                Owner: {currentService.owner}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 space-y-1.5">
              <div className="flex justify-between">
                <span>Reporter:</span>
                <strong className="text-white">{currentUser.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Target SLA:</span>
                <strong className="text-cyan-400 font-mono">
                  {severity === 'Critical' ? '60 mins' : severity === 'High' ? '240 mins' : severity === 'Medium' ? '720 mins' : '1440 mins'}
                </strong>
              </div>
            </div>
          </div>

          {/* Dynamic Live Email Notification Preview */}
          <div className="p-5 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Live Email Notification Preview</span>
              </div>
              <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                Simulated
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0a0d18] border border-[#1a2238] text-xs font-mono space-y-2 text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px]">TO:</span>
                <span className="text-cyan-400 font-medium break-all">
                  {toRecipients.join(', ')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">CC:</span>
                <span className="text-slate-400 break-all">
                  {ccRecipients.join(', ')}
                </span>
              </div>
              <div className="pt-2 border-t border-[#1b233a]">
                <span className="text-slate-500 block text-[10px]">SUBJECT:</span>
                <span className="font-bold text-white">
                  [{severity.toUpperCase()} INCIDENT] {nextTicketId}: {title || 'Untitled Incident'}
                </span>
              </div>
              <div className="pt-2 border-t border-[#1b233a] text-[11px] text-slate-300 leading-relaxed font-sans">
                A new {severity} incident has been registered by {currentUser.name}.
                <br />
                <strong>App:</strong> {application} ({service})
                <br />
                <strong>Entity:</strong> {impactedEntity}
                <br />
                Immediate triage is required under SLA policy.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Incident Dispatch"
        description="Verify details before broadcasting alert to support team distribution lists."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
            <p><strong>Ticket ID:</strong> {nextTicketId}</p>
            <p><strong>Title:</strong> {title}</p>
            <p><strong>Application:</strong> {application}</p>
            <p><strong>Severity:</strong> {severity} ({priority})</p>
            <p><strong>Assigned Team:</strong> {assignedTeam}</p>
          </div>
          <p className="text-xs text-slate-500">
            Clicking confirm will store this record into LocalStorage, generate an initial operational tracker row, and log an email notification.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Back to Edit
            </button>
            <button
              onClick={confirmCreation}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
            >
              Confirm & Dispatch
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
