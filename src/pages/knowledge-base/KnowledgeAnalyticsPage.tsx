import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
} from 'recharts';
import {
  BarChart3,
  TrendingDown,
  Sparkles,
  BookOpen,
  ThumbsUp,
  Search,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const KnowledgeAnalyticsPage: React.FC = () => {
  const { knowledgeArticles, documents } = useApp();

  // Analytics data
  const mostSearchedTopics = [
    { topic: 'Payment Timeouts', queries: 480 },
    { topic: 'DB Connection Starvation', queries: 412 },
    { topic: 'Keycloak OIDC Latency', queries: 285 },
    { topic: 'BGP Leased Line Flap', queries: 240 },
    { topic: 'Kafka Consumer Lag', queries: 195 },
  ];

  const viewsData = knowledgeArticles.slice(0, 5).map((a) => ({
    name: a.title.slice(0, 24) + '...',
    views: a.views,
  }));

  const mttrReductionTrend = [
    { month: 'May', mttr: 115 },
    { month: 'Jun', mttr: 102 },
    { month: 'Jul', mttr: 94 },
    { month: 'Aug', mttr: 85 },
    { month: 'Sep', mttr: 78 },
    { month: 'Oct', mttr: 74 },
  ];

  const departmentUsage = [
    { dept: 'Card Operations', usage: 38 },
    { dept: 'Core Banking', usage: 29 },
    { dept: 'Cloud SRE', usage: 22 },
    { dept: 'Digital Web', usage: 11 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950/70 text-cyan-300 border border-indigo-800 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            RAG TELEMETRY & ADOPTION
          </span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-400 font-semibold">MTTR Impact & Knowledge Metrics</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
          Knowledge Base Analytics & Impact
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Quantifying the operational impact of AI-assisted runbook retrieval on mean time to resolution (MTTR).
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Runbook Views</span>
          <p className="text-2xl font-black text-white font-mono mt-1">11,280</p>
          <span className="text-[11px] text-emerald-400 font-semibold">+24% this month</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Helpfulness Score</span>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-1">89.0%</p>
          <span className="text-[11px] text-slate-400">Based on 680 engineer ratings</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall MTTR Reduction</span>
          <p className="text-2xl font-black text-cyan-400 font-mono mt-1">-35.6%</p>
          <span className="text-[11px] text-slate-400">From 115m down to 74m</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Zero-Result Searches</span>
          <p className="text-2xl font-black text-white font-mono mt-1">1.6%</p>
          <span className="text-[11px] text-slate-400">High semantic recall</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MTTR Reduction Trend */}
        <div className="p-5 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
            Mean Time to Resolution (MTTR) Trend in Minutes
          </h3>
          <p className="text-[11px] text-slate-400 mb-4">Steady reduction following automated runbook indexing</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mttrReductionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c243b" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090c14',
                    borderColor: '#1c243b',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="mttr" name="MTTR (Mins)" stroke="#38bdf8" fill="#38bdf825" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Searched Topics */}
        <div className="p-5 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
            Most Frequently Queried Diagnostic Topics
          </h3>
          <p className="text-[11px] text-slate-400 mb-4">Total RAG vector searches by query theme</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={mostSearchedTopics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c243b" opacity={0.6} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis dataKey="topic" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={140} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090c14',
                    borderColor: '#1c243b',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="queries" name="Queries" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Viewed Articles */}
        <div className="p-5 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
            Top Knowledge Runbooks by Engineer Views
          </h3>
          <p className="text-[11px] text-slate-400 mb-4">Highest read volumes across support teams</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c243b" opacity={0.6} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090c14',
                    borderColor: '#1c243b',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="views" name="Page Views" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Knowledge Usage by Department */}
        <div className="p-5 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
            Knowledge Base Usage by Department (%)
          </h3>
          <p className="text-[11px] text-slate-400 mb-4">Adoption distribution across business units</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c243b" opacity={0.6} />
                <XAxis dataKey="dept" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090c14',
                    borderColor: '#1c243b',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="usage" name="% Adoption" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
