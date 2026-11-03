import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  FolderLock,
  MessageSquareCode,
  SearchCode,
  FileText,
  BarChart3,
  CheckCircle2,
  Clock,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Database,
  Cpu,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const KnowledgeDashboardPage: React.FC = () => {
  const { documents, knowledgeArticles } = useApp();

  const totalDocs = documents.length;
  const indexedDocs = documents.filter((d) => d.status === 'Indexed').length;
  const totalArticles = knowledgeArticles.length;
  const totalQueries = 1420;
  const searchSuccessRate = 98.4;
  const avgMttrReduction = '34%';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950/70 text-cyan-300 border border-indigo-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            RAG VECTOR ENGINE
          </span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-400 font-semibold">Semantic Retrieval & Synthesis Hub</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
          Enterprise AI Knowledge Base & RAG Platform
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Unified neural search across standard operating procedures (SOPs), incident runbooks, architecture diagrams, and post-mortems.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Documents</span>
          <p className="text-xl font-black text-white font-mono mt-1">{totalDocs}</p>
          <span className="text-[10px] text-slate-400">PDF, DOCX, MD</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Indexed Vectors</span>
          <p className="text-xl font-black text-emerald-400 font-mono mt-1">{indexedDocs}</p>
          <span className="text-[10px] text-emerald-400">100% Vectorized</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Runbooks</span>
          <p className="text-xl font-black text-cyan-400 font-mono mt-1">{totalArticles}</p>
          <span className="text-[10px] text-slate-400">Curated Guides</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Queries Handled</span>
          <p className="text-xl font-black text-white font-mono mt-1">{totalQueries}</p>
          <span className="text-[10px] text-slate-400">30-day volume</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Accuracy</span>
          <p className="text-xl font-black text-white font-mono mt-1">{searchSuccessRate}%</p>
          <span className="text-[10px] text-emerald-400">Relevance score</span>
        </div>

        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/60 shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">MTTR Reduction</span>
          <p className="text-xl font-black text-cyan-300 font-mono mt-1">{avgMttrReduction}</p>
          <span className="text-[10px] text-cyan-400 font-medium">Faster triage</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/knowledge/chat"
          className="p-5 rounded-xl border border-[#1c243b] bg-[#0e1220] hover:border-cyan-500/60 hover:bg-[#121626] transition-all group shadow-md"
        >
          <div className="p-2.5 rounded-lg bg-[#161c2e] text-cyan-400 w-fit mb-3 border border-[#232e4d]">
            <MessageSquareCode className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
            AI Knowledge Chat (RAG)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Query organizational knowledge in plain natural language with exact document page citations.
          </p>
          <div className="mt-3 text-xs font-semibold text-cyan-400 flex items-center gap-1">
            <span>Launch Chat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/knowledge/search"
          className="p-5 rounded-xl border border-[#1c243b] bg-[#0e1220] hover:border-cyan-500/60 hover:bg-[#121626] transition-all group shadow-md"
        >
          <div className="p-2.5 rounded-lg bg-[#161c2e] text-cyan-400 w-fit mb-3 border border-[#232e4d]">
            <SearchCode className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
            Semantic Search
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Search with vector similarity scores across all 15 operational runbooks and guides.
          </p>
          <div className="mt-3 text-xs font-semibold text-cyan-400 flex items-center gap-1">
            <span>Explore Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/knowledge/documents"
          className="p-5 rounded-xl border border-[#1c243b] bg-[#0e1220] hover:border-emerald-500/60 hover:bg-[#121626] transition-all group shadow-md"
        >
          <div className="p-2.5 rounded-lg bg-[#161c2e] text-emerald-400 w-fit mb-3 border border-[#232e4d]">
            <FolderLock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
            Document Library
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Drag-and-drop document upload, vector processing status, and document preview modals.
          </p>
          <div className="mt-3 text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <span>Manage Documents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/knowledge/articles"
          className="p-5 rounded-xl border border-[#1c243b] bg-[#0e1220] hover:border-indigo-500/60 hover:bg-[#121626] transition-all group shadow-md"
        >
          <div className="p-2.5 rounded-lg bg-[#161c2e] text-indigo-400 w-fit mb-3 border border-[#232e4d]">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
            Knowledge Articles
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Curated step-by-step troubleshooting checklists with helpfulness rating feedback.
          </p>
          <div className="mt-3 text-xs font-semibold text-indigo-400 flex items-center gap-1">
            <span>Browse Runbooks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Frequently Accessed Runbooks */}
      <div className="p-5 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Most Frequently Referenced Incident Runbooks
            </h3>
            <p className="text-[11px] text-slate-400">Ranked by engineer helpfulness votes and incident citations</p>
          </div>
          <Link to="/knowledge/articles" className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline">
            View all 10 articles &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {knowledgeArticles.slice(0, 4).map((art) => (
            <div
              key={art.id}
              className="p-3.5 rounded-xl border border-[#1c243b] bg-[#0a0d18] hover:border-cyan-500/50 hover:bg-[#121626] transition-all flex items-start justify-between gap-3"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {art.category}
                </span>
                <h4 className="text-xs font-bold text-white mt-0.5 line-clamp-1">
                  {art.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{art.description}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                  <span>Author: <strong className="text-slate-300">{art.author}</strong></span>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold">{art.helpfulCount} helpful votes</span>
                </div>
              </div>
              <Link
                to={`/knowledge/articles?id=${art.id}`}
                className="p-1.5 rounded text-cyan-400 hover:bg-[#161c2e] shrink-0 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
