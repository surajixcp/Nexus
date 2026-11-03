import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertOctagon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Server,
  ArrowUpRight,
  ExternalLink,
  Bot,
  Zap,
  Users,
  Radio,
  FileCode2,
  Send,
  MessageSquare,
  Filter,
  RotateCcw,
  Download,
  Calendar,
  Layers,
  BarChart3,
  PieChart as PieChartIcon,
  Copy,
  Check,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { SeverityBadge, StatusBadge, PriorityBadge, SLARiskBadge } from '../../components/ui/Badge';
import { IncidentDetailsDrawer } from '../../components/incidents/IncidentDetailsDrawer';
import { Incident } from '../../types';
import { formatDuration } from '../../utils/calculations';
import { Link, useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { incidents, escalations, applications, trackerRecords, currentUser, addToast } = useApp();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [timeframe, setTimeframe] = useState<'12m' | '30d' | '7d' | '24h'>('7d');
  const [aiPrompt, setAiPrompt] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Power BI Visual Slicers state (matching user's Power BI / NocoBase screenshot)
  const [filterCreatedAt, setFilterCreatedAt] = useState<string>('all');
  const [filterServiceGroup, setFilterServiceGroup] = useState<string>('all');
  const [filterRequestType, setFilterRequestType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterSlaStatus, setFilterSlaStatus] = useState<string>('all');

  const handleResetFilters = () => {
    setFilterCreatedAt('all');
    setFilterServiceGroup('all');
    setFilterRequestType('all');
    setFilterPriority('all');
    setFilterSlaStatus('all');
    addToast('Filters Reset', 'Power BI slicers restored to default view', 'info');
  };

  const getSlaStatus = (inc: Incident): 'Breached' | 'Warning' | 'Running' | 'Paused' => {
    if (inc.status === 'Resolved' || inc.status === 'Closed') return 'Running';
    if (inc.severity === 'Critical') return 'Breached';
    if (inc.status === 'Escalated') return 'Warning';
    return 'Running';
  };

  // Filter incidents based on active Power BI slicers
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      if (filterServiceGroup !== 'all' && inc.application !== filterServiceGroup) return false;
      if (filterRequestType !== 'all' && inc.category !== filterRequestType) return false;
      if (filterPriority !== 'all' && inc.priority !== filterPriority) return false;
      if (filterSlaStatus !== 'all' && getSlaStatus(inc) !== filterSlaStatus) return false;
      return true;
    });
  }, [incidents, filterServiceGroup, filterRequestType, filterPriority, filterSlaStatus]);

  // Power BI Top 6 Metric Card calculations
  const openBacklogCount = filteredIncidents.filter((i) => i.status === 'Open' || i.status === 'In Progress').length;
  const unassignedCount = filteredIncidents.filter((i) => !i.assignee || i.assignee === 'Unassigned').length;
  const slaWarningCount = filteredIncidents.filter((i) => getSlaStatus(i) === 'Warning').length;
  const slaBreachedCount = filteredIncidents.filter((i) => getSlaStatus(i) === 'Breached').length;
  const newTicketsCount = filteredIncidents.filter((i) => i.status === 'Open').length;
  const resolvedTicketsCount = filteredIncidents.filter((i) => i.status === 'Resolved' || i.status === 'Closed').length;

  // Global metrics
  const totalIncidents = incidents.length;
  const criticalIncidents = incidents.filter((i) => i.severity === 'Critical').length;
  const activeEscalations = escalations.filter((e) => e.status === 'Active').length;
  const resolvedTrackers = trackerRecords.filter((t) => t.status === 'Resolved' && t.durationMinutes > 0);
  const avgMttrMinutes = resolvedTrackers.length
    ? Math.round(
        resolvedTrackers.reduce((acc, t) => acc + t.reportedDurationMinutes, 0) / resolvedTrackers.length
      )
    : 74;
  const slaCompliancePct = 96.8;

  // Chart 1: Created Tickets Trend (Smooth line with area fill matching Power BI screenshot)
  const createdTicketsTrendData = [
    { date: 'Jul 01', tickets: 5, resolved: 3 },
    { date: 'Jul 02', tickets: 4, resolved: 4 },
    { date: 'Jul 03', tickets: 6, resolved: 2 },
    { date: 'Jul 04', tickets: 3, resolved: 3 },
    { date: 'Jul 05', tickets: 2, resolved: 4 },
    { date: 'Jul 06', tickets: 1, resolved: 2 },
  ];

  // Chart 2: SLA Status Horizontal Bar Chart (Matching Power BI screenshot)
  const slaStatusData = [
    { name: 'None', count: 1, color: '#64748b' },
    { name: 'Met', count: 2, color: '#10b981' },
    { name: 'Paused', count: 1, color: '#eab308' },
    { name: 'Running', count: 2, color: '#3b82f6' },
    { name: 'Warning', count: 1, color: '#f97316' },
    { name: 'Breached', count: 2, color: '#ef4444' },
  ];

  // Chart 3: Ticket Status Vertical Bar Chart (Matching Power BI screenshot)
  const ticketStatusData = [
    { name: 'New', count: filteredIncidents.filter((i) => i.status === 'Open').length || 2, color: '#3b82f6' },
    { name: 'Open', count: filteredIncidents.filter((i) => i.status === 'In Progress').length || 3, color: '#10b981' },
    { name: 'Pending customer', count: 1, color: '#f59e0b' },
    { name: 'Resolved', count: filteredIncidents.filter((i) => i.status === 'Resolved').length || 2, color: '#06b6d4' },
    { name: 'Closed', count: filteredIncidents.filter((i) => i.status === 'Closed').length || 1, color: '#64748b' },
  ];

  // Chart 4: Priority Mix Donut Chart (Matching Power BI screenshot)
  const priorityMixData = [
    { name: 'Urgent (P1)', value: filteredIncidents.filter((i) => i.priority === 'P1').length || 2, color: '#ef4444' },
    { name: 'High (P2)', value: filteredIncidents.filter((i) => i.priority === 'P2').length || 1, color: '#f97316' },
    { name: 'Normal (P3)', value: filteredIncidents.filter((i) => i.priority === 'P3').length || 3, color: '#3b82f6' },
    { name: 'Low (P4)', value: filteredIncidents.filter((i) => i.priority === 'P4').length || 1, color: '#64748b' },
  ];

  // Chart 5: Squad MTTA vs MTTR Combi Chart (Power BI dual-axis style)
  const squadEfficiencyData = [
    { squad: 'PayWave L3', mtta: 14, mttr: 68 },
    { squad: 'DBA Ops', mtta: 22, mttr: 85 },
    { squad: 'Core Banking', mtta: 18, mttr: 75 },
    { squad: 'IAM Support', mtta: 9, mttr: 55 },
    { squad: 'Platform SRE', mtta: 11, mttr: 62 },
  ];

  // Heatmap Matrix: Application vs Priority Breakdown
  const heatmapMatrix = applications.map((app) => {
    const appIncs = incidents.filter((i) => i.application === app.name);
    return {
      appName: app.name,
      p1: appIncs.filter((i) => i.priority === 'P1').length,
      p2: appIncs.filter((i) => i.priority === 'P2').length,
      p3: appIncs.filter((i) => i.priority === 'P3').length,
      p4: appIncs.filter((i) => i.priority === 'P4').length,
      total: appIncs.length,
    };
  });

  // Critical alerts
  const criticalAlerts = incidents.filter(
    (i) => i.severity === 'Critical' && i.status !== 'Resolved' && i.status !== 'Closed'
  );

  const copyTicketId = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    addToast('Copied', `Ticket ID ${text} copied`, 'info');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Resq.io Welcome Header & Operations Command Strip */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0c0f1d] via-[#0d1222] to-[#0a0d18] border border-[#1b233a] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                Nexus Incident Command &middot; Power BI Operations Analytics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Executive business intelligence, cross-application telemetry, SLA risk analysis, and squad resolution benchmarks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                addToast('Power BI Export', 'Exporting interactive report summary (.pbix / PDF)', 'success');
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-cyan-300 bg-[#121626] border border-[#202840] hover:border-cyan-500/50 hover:bg-[#181d33] rounded-xl shadow-inner transition-all"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Power BI Report</span>
            </button>
            <Link
              to="/create-incident"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-xl shadow-lg shadow-indigo-950/50 transition-all hover:scale-[1.02]"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>+ Report Incident</span>
            </Link>
          </div>
        </div>

        {/* Operational Strip */}
        <div className="relative z-10 mt-6 pt-5 border-t border-[#1a2137] grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#090c17]/80 border border-[#161c2e]">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Primary On-Call</p>
              <p className="text-xs font-semibold text-white">{currentUser.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#090c17]/80 border border-[#161c2e]">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Core Availability</p>
              <p className="text-xs font-semibold text-emerald-300">99.98% SLA Met</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#090c17]/80 border border-[#161c2e]">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Critical Incidents</p>
              <p className="text-xs font-semibold text-rose-300">{criticalIncidents} Logged ({criticalAlerts.length} Active)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#090c17]/80 border border-[#161c2e]">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Mean Time To Resolve</p>
              <p className="text-xs font-semibold text-purple-300">{formatDuration(avgMttrMinutes)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          POWER BI SLICER & FILTER BAR (Matching NocoBase screenshot)
          ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#1b233a]">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Interactive Power BI Slicers & Filters
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">
              ({filteredIncidents.length} of {incidents.length} records matching)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#121626] border border-[#1f2842] hover:border-slate-500 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => {
                addToast('Slicers Applied', `Displaying ${filteredIncidents.length} incidents in dashboard`, 'info');
              }}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-900/40 transition-colors"
            >
              Filter
            </button>
          </div>
        </div>

        {/* 5 Slicer Dropdowns in responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Created at Slicer */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Created at :</label>
            <div className="flex items-center gap-1.5">
              <select
                value={filterCreatedAt}
                onChange={(e) => setFilterCreatedAt(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-[#121626] border border-[#1f2842] text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
              >
                <option value="all">Exact day · All Time</option>
                <option value="today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Service group Slicer */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Service group :</label>
            <select
              value={filterServiceGroup}
              onChange={(e) => setFilterServiceGroup(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#121626] border border-[#1f2842] text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
            >
              <option value="all">All Service Groups</option>
              {applications.map((app) => (
                <option key={app.id} value={app.name}>{app.name}</option>
              ))}
            </select>
          </div>

          {/* Request type Slicer */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Request type :</label>
            <select
              value={filterRequestType}
              onChange={(e) => setFilterRequestType(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#121626] border border-[#1f2842] text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
            >
              <option value="all">All Request Types</option>
              <option value="Application Incident">Application Incident</option>
              <option value="Database Degradation">Database Degradation</option>
              <option value="Network Outage">Network Outage</option>
              <option value="Security Incident">Security Incident</option>
            </select>
          </div>

          {/* Priority Slicer */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Priority :</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#121626] border border-[#1f2842] text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
            >
              <option value="all">All Priorities</option>
              <option value="P1">P1 - Urgent</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Normal</option>
              <option value="P4">P4 - Low</option>
            </select>
          </div>

          {/* SLA status Slicer */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">SLA status :</label>
            <select
              value={filterSlaStatus}
              onChange={(e) => setFilterSlaStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#121626] border border-[#1f2842] text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
            >
              <option value="all">All SLA Statuses</option>
              <option value="Breached">Breached</option>
              <option value="Warning">Warning</option>
              <option value="Running">Running</option>
              <option value="Paused">Paused</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          POWER BI 6 KPI CARDS (Matching NocoBase screenshot layout)
          ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Open Backlog */}
        <div className="p-4 rounded-2xl bg-[#0e1220] border border-[#1c243b] hover:border-cyan-500/40 shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">Open backlog</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Active
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-white font-mono">
            {openBacklogCount}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Still in progress</p>
        </div>

        {/* 2. Unassigned */}
        <div className="p-4 rounded-2xl bg-[#0e1220] border border-[#1c243b] hover:border-purple-500/40 shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">Unassigned</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Queue
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-white font-mono">
            {unassignedCount}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {filteredIncidents.length ? Math.round((unassignedCount / filteredIncidents.length) * 100) : 0}% of active tickets
          </p>
        </div>

        {/* 3. SLA warning */}
        <div className="p-4 rounded-2xl bg-[#0e1220] border border-[#1c243b] hover:border-amber-500/40 shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">SLA warning</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Watch
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-300 font-mono">
            {slaWarningCount}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {filteredIncidents.length ? Math.round((slaWarningCount / filteredIncidents.length) * 100) : 0}% of active tickets
          </p>
        </div>

        {/* 4. SLA breached */}
        <div className="p-4 rounded-2xl bg-[#0e1220] border border-rose-500/40 hover:border-rose-500 shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">SLA breached</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
              Act now
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-rose-300 font-mono">
            {slaBreachedCount}
          </div>
          <p className="mt-1 text-[11px] text-rose-300/80">
            {filteredIncidents.length ? Math.round((slaBreachedCount / filteredIncidents.length) * 100) : 0}% of active tickets
          </p>
        </div>

        {/* 5. New tickets */}
        <div className="p-4 rounded-2xl bg-[#0e1220] border border-[#1c243b] hover:border-cyan-500/40 shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">New tickets</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Intake
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-white font-mono">
            {newTicketsCount}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Created with current filters</p>
        </div>

        {/* 6. Resolved tickets */}
        <div className="p-4 rounded-2xl bg-[#0e1220] border border-[#1c243b] hover:border-emerald-500/40 shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">Resolved tickets</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Done
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
            {resolvedTicketsCount}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Resolved with current filters</p>
        </div>
      </div>

      {/* =========================================================================
          POWER BI CHARTS ROW 1 (Matching NocoBase screenshot):
          - Created tickets trend (Line with Area)
          - SLA status (Horizontal Bars)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Created Tickets Trend (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Created Tickets Trend
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Continuous incident intake volume across timeline</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121626] text-cyan-400 border border-[#1f2842]">
              Power BI Line
            </span>
          </div>

          <div className="h-60 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={createdTicketsTrendData}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f273d" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 8]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0f1b',
                    borderColor: '#242d47',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tickets"
                  name="Created Tickets"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorTickets)"
                  dot={{ r: 4, fill: '#3b82f6' }}
                  activeDot={{ r: 6, fill: '#60a5fa' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Status Horizontal Bars (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                SLA Status
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Horizontal status distribution by SLA state</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121626] text-emerald-400 border border-[#1f2842]">
              Power BI Bar
            </span>
          </div>

          <div className="h-60 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={slaStatusData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f273d" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 3]} />
                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} width={65} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0f1b',
                    borderColor: '#242d47',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="count" name="Tickets" radius={[0, 6, 6, 0]}>
                  {slaStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* =========================================================================
          POWER BI CHARTS ROW 2 (Matching NocoBase screenshot):
          - Ticket status (Vertical Bar Chart)
          - Priority mix (Donut Chart)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket status (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Ticket Status
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Volume distribution across lifecycle stages</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121626] text-cyan-400 border border-[#1f2842]">
              Column Chart
            </span>
          </div>

          <div className="h-60 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f273d" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 5]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0f1b',
                    borderColor: '#242d47',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="count" name="Tickets" radius={[6, 6, 0, 0]}>
                  {ticketStatusData.map((entry, index) => (
                    <Cell key={`status-bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority mix Donut (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Priority Mix
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Severity tier proportional donut ratio</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121626] text-rose-400 border border-[#1f2842]">
              Power BI Donut
            </span>
          </div>

          <div className="h-56 sm:h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityMixData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name.split(' ')[0]}: ${value}`}
                  labelLine={false}
                >
                  {priorityMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0f1b',
                    borderColor: '#242d47',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-[11px] text-slate-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* =========================================================================
          POWER BI ROW 3:
          - Squad MTTA vs MTTR Composed Chart (Dual-Axis Combi Chart)
          - Application vs Severity Heatmap Matrix Grid
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Squad MTTA vs MTTR Combi Chart (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Squad MTTA vs MTTR Benchmarks
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Mean Time to Acknowledge (line) vs Mean Time to Resolve (bars)</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121626] text-purple-400 border border-[#1f2842]">
              Combi Dual-Axis
            </span>
          </div>

          <div className="h-60 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={squadEfficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f273d" vertical={false} />
                <XAxis dataKey="squad" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0f1b',
                    borderColor: '#242d47',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar yAxisId="left" dataKey="mttr" name="MTTR (mins)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="mtta" name="MTTA (mins)" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application vs Severity Heatmap Matrix (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Application &times; Severity Heatmap Matrix
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Cross-filtering risk density across banking architecture</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121626] text-amber-400 border border-[#1f2842]">
                Power BI Matrix
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1b233a] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-2 font-semibold">Service Application</th>
                    <th className="pb-2 text-center font-semibold text-rose-400">P1 (Urgent)</th>
                    <th className="pb-2 text-center font-semibold text-amber-400">P2 (High)</th>
                    <th className="pb-2 text-center font-semibold text-blue-400">P3 (Normal)</th>
                    <th className="pb-2 text-center font-semibold text-slate-400">P4 (Low)</th>
                    <th className="pb-2 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161d30]">
                  {heatmapMatrix.map((row) => (
                    <tr
                      key={row.appName}
                      onClick={() => setFilterServiceGroup(row.appName)}
                      className="hover:bg-[#121626] cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 font-medium text-slate-200 max-w-[160px] truncate">
                        {row.appName.replace(' Internet Banking', '').replace(' Banking', '').replace(' Platform', '')}
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          row.p1 > 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-600'
                        }`}>
                          {row.p1}
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          row.p2 > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-600'
                        }`}>
                          {row.p2}
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          row.p3 > 0 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-600'
                        }`}>
                          {row.p3}
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          row.p4 > 0 ? 'bg-slate-500/20 text-slate-300 border border-slate-500/40' : 'text-slate-600'
                        }`}>
                          {row.p4}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-cyan-300">
                        {row.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 mt-2 text-right">
            Click any row to filter dashboard by application
          </p>
        </div>
      </div>

      {/* =========================================================================
          POWER BI PRIORITY DRILLDOWN: Top active tickets by SLA risk
          (Matching bottom table of NocoBase screenshot)
          ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Priority Drilldown &middot; Top Active Tickets by SLA Risk
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Power BI operational grid with assignment team, SLA countdown, and direct command inspection
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Showing top {Math.min(5, filteredIncidents.length)} tickets
            </span>
            <Link
              to="/incidents"
              className="px-3 py-1 text-xs font-semibold text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-colors flex items-center gap-1"
            >
              All tickets &rarr;
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1b233a] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 font-semibold">Ticket</th>
                <th className="pb-3 font-semibold">Customer / Impacted Service</th>
                <th className="pb-3 font-semibold">Assignment</th>
                <th className="pb-3 font-semibold">SLA</th>
                <th className="pb-3 font-semibold">Activity</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161d30]">
              {filteredIncidents.slice(0, 5).map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="hover:bg-[#121626] cursor-pointer transition-colors group"
                >
                  {/* Ticket Column */}
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-cyan-400 flex items-center gap-1">
                        {inc.ticketId}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyTicketId(inc.id, inc.ticketId);
                          }}
                          className="hover:text-white"
                          title="Copy ticket ID"
                        >
                          {copiedId === inc.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                          )}
                        </button>
                      </span>
                      <StatusBadge status={inc.status} />
                      <PriorityBadge priority={inc.priority} />
                    </div>
                    <p className="font-medium text-slate-200 truncate max-w-xs sm:max-w-md group-hover:text-cyan-300 transition-colors">
                      {inc.title}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {inc.category}
                    </p>
                  </td>

                  {/* Customer / Service */}
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-white">{inc.impactedEntity}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{inc.application}</p>
                  </td>

                  {/* Assignment */}
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-white">{inc.assignee || 'On-Call Pool'}</p>
                    <p className="text-[10px] text-slate-400">{inc.assignedTeam}</p>
                  </td>

                  {/* SLA */}
                  <td className="py-3.5 px-3">
                    <SLARiskBadge status={getSlaStatus(inc)} />
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Target: {inc.slaMinutes}m
                    </p>
                  </td>

                  {/* Activity */}
                  <td className="py-3.5 px-3">
                    <p className="text-slate-300 font-mono text-[11px]">
                      {new Date(inc.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-[10px] text-slate-500">Last activity</p>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 pl-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIncident(inc);
                      }}
                      className="px-3 py-1 text-[11px] font-semibold text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Details Drawer for Deep Inspection */}
      <IncidentDetailsDrawer
        incident={selectedIncident}
        isOpen={Boolean(selectedIncident)}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  );
};
