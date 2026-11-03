import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationDefinition, ServiceDefinition } from '../../types';
import {
  Server,
  Globe,
  CreditCard,
  Smartphone,
  Network,
  Building2,
  Mail,
  Shield,
  Clock,
  User,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
} from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const { applications, incidents } = useApp();
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || 'app-1');

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const getAppIcon = (name: string) => {
    switch (name) {
      case 'DemoBank Core':
        return <Building2 className="w-5 h-5 text-indigo-400" />;
      case 'FinEdge Internet Banking':
        return <Globe className="w-5 h-5 text-blue-400" />;
      case 'PayWave Gateway':
        return <CreditCard className="w-5 h-5 text-emerald-400" />;
      case 'DemoMobile Banking':
        return <Smartphone className="w-5 h-5 text-purple-400" />;
      case 'DemoAPI Platform':
        return <Network className="w-5 h-5 text-cyan-400" />;
      case 'DemoInfra Services':
      default:
        return <Server className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950/70 text-cyan-300 border border-indigo-800">
            SYSTEM CATALOG & SLA MATRIX
          </span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-400 font-semibold">Tier 1 & Tier 2 Core Services</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
          Application & Service Architecture Management
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure service owners, support team mappings, SLA thresholds, and automated email broadcast distribution lists.
        </p>
      </div>

      {/* Application Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((app) => {
          const isSelected = app.id === selectedAppId;
          const appIncidents = incidents.filter((i) => i.application === app.name);
          const activeIncidents = appIncidents.filter((i) => i.status !== 'Resolved' && i.status !== 'Closed').length;

          return (
            <div
              key={app.id}
              onClick={() => setSelectedAppId(app.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-950/20 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-950/50'
                  : 'border-[#1c243b] bg-[#0e1220] hover:border-[#273456] hover:bg-[#121626]'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#161c2e] border border-[#232e4d]">
                    {getAppIcon(app.name)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{app.name}</h3>
                    <span className="font-mono text-[10px] text-cyan-400">{app.code}</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    app.status === 'Healthy'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                      : app.status === 'Degraded'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                      : 'bg-rose-950/80 text-rose-300 border-rose-800/60 animate-pulse'
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                {app.description}
              </p>

              <div className="pt-2 border-t border-[#1c243b] flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">{app.services.length} Microservices</span>
                <span className="font-semibold text-slate-200">
                  {activeIncidents > 0 ? (
                    <span className="text-rose-400 font-bold">{activeIncidents} Active Outages</span>
                  ) : (
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      All Operational
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Application Detailed Services Breakdown */}
      {selectedApp && (
        <div className="p-6 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#1c243b]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400">{selectedApp.code}</span>
                <h2 className="text-base font-bold text-white">{selectedApp.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-[#161c2e] text-indigo-300 border border-[#232e4d] font-medium">
                  {selectedApp.tier}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedApp.description}</p>
            </div>
          </div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Configured Microservices & SLA Distribution Matrix ({selectedApp.services.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedApp.services.map((srv) => (
              <div
                key={srv.id}
                className="p-4 rounded-xl border border-[#1c243b] bg-[#0a0d18] space-y-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {srv.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>Owner: <strong className="text-slate-300">{srv.owner}</strong></span>
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#121626] border border-[#1f2842] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Support Team:</span>
                    <strong className="text-cyan-400 font-semibold">{srv.supportTeam}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Target SLA:</span>
                    <span className="font-mono font-bold text-white">{srv.slaHours} hours</span>
                  </div>
                </div>

                {/* Email distribution list */}
                <div className="text-[11px] space-y-1 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Default TO:</span>
                    <span className="text-cyan-400 break-all">{srv.defaultToRecipients.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Default CC:</span>
                    <span className="text-slate-400 break-all">{srv.defaultCcRecipients.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
