import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { KnowledgeDocument } from '../../types';
import { Modal } from '../../components/ui/Modal';
import {
  Search,
  Sparkles,
  BookOpen,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Tag,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const SemanticSearchPage: React.FC = () => {
  const { documents } = useApp();

  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);
  const [recentQueries, setRecentQueries] = useState<string[]>([
    'payment gateway timeout triage',
    'PostgreSQL connection pool max_connections',
    'Keycloak SSO session cache eviction',
    'interbank clearing settlement failure',
  ]);

  const categories = Array.from(new Set(documents.map((d) => d.category)));

  // Simulated relevance scores
  const results = useMemo(() => {
    const qLower = query.toLowerCase().trim();

    return documents
      .map((doc, idx) => {
        let score = 70;
        if (!qLower) {
          score = 95 - idx * 2;
        } else {
          if (doc.title.toLowerCase().includes(qLower)) score += 20;
          if (doc.excerpt.toLowerCase().includes(qLower)) score += 15;
          if (doc.category.toLowerCase().includes(qLower)) score += 10;
          if (doc.content.toLowerCase().includes(qLower)) score += 10;
        }
        score = Math.min(99, Math.max(65, score));
        return { doc, score };
      })
      .filter(({ doc, score }) => {
        const matchCat = categoryFilter === 'All' || doc.category === categoryFilter;
        if (!query.trim()) return matchCat;
        const inText =
          doc.title.toLowerCase().includes(qLower) ||
          doc.excerpt.toLowerCase().includes(qLower) ||
          doc.category.toLowerCase().includes(qLower) ||
          doc.content.toLowerCase().includes(qLower);
        return matchCat && inText;
      })
      .sort((a, b) => b.score - a.score);
  }, [documents, query, categoryFilter]);

  const handleSelectRecent = (q: string) => {
    setQuery(q);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            NEURAL SEMANTIC EMBEDDINGS
          </span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-400 font-semibold">Ranked by Vector Similarity</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
          Semantic Knowledge & Runbook Search
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Natural-language contextual discovery with dynamic similarity scoring and excerpt matches.
        </p>
      </div>

      {/* Main Search Input */}
      <div className="p-5 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-cyan-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search procedures (e.g. 'How do I handle Kafka consumer lag during month-end?')..."
            className="w-full pl-12 pr-4 py-3 text-sm bg-[#121626] border border-[#1f2842] rounded-xl focus:outline-hidden focus:border-cyan-500 text-white font-medium placeholder-slate-500 shadow-inner"
          />
        </div>

        {/* Filters and Recent Queries */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Recent:
            </span>
            {recentQueries.map((rq, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectRecent(rq)}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-[#161c2e] border border-[#232e4d] text-slate-300 hover:text-cyan-300 hover:border-cyan-500 shrink-0 transition-colors"
              >
                {rq}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1 bg-[#121626] border border-[#1f2842] rounded-md text-slate-200 text-xs focus:outline-hidden"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ranked Search Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Found <strong className="text-white">{results.length}</strong> semantic matches</span>
          <span className="font-mono text-cyan-400/80">Ranked by Cosine Similarity</span>
        </div>

        {results.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-[#0e1220] rounded-xl border border-[#1c243b]">
            No knowledge documents matched your query. Try searching for "PostgreSQL", "PayWave", or "SLA".
          </div>
        ) : (
          results.map(({ doc, score }) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="p-4 rounded-xl border border-[#1c243b] bg-[#0e1220] shadow-md hover:border-cyan-500/60 hover:bg-[#121626] cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#161c2e] text-cyan-300 border border-[#232e4d]">
                    {doc.fileType} · {doc.pages} Pages
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-300">
                    {doc.category}
                  </span>
                </div>

                {/* Similarity Percentage badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 text-xs font-bold font-mono">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>{score}% Match</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">
                {doc.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {doc.excerpt}
              </p>

              <div className="pt-2 border-t border-[#1c243b] flex items-center justify-between text-[11px] text-slate-400">
                <span>Department: <strong className="text-slate-300">{doc.department}</strong> · Author: {doc.author}</span>
                <span className="text-cyan-400 font-semibold hover:underline flex items-center gap-1">
                  <span>View Runbook Protocol</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Document Inspector Modal */}
      <Modal
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.title || 'Document Protocol'}
        description={`${selectedDoc?.category} · Author: ${selectedDoc?.author} (${selectedDoc?.department})`}
        maxWidth="2xl"
      >
        {selectedDoc && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#090c14] border border-[#1b233a] font-mono text-xs text-cyan-200/90 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {selectedDoc.content}
            </div>
            <div className="flex justify-end pt-2 border-t border-[#1c243b]">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-[#121626] border border-[#1f2842] rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
