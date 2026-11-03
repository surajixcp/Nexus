import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { KnowledgeArticle } from '../../types';
import {
  FileText,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Copy,
  Search,
  Tag,
  CheckSquare,
  ArrowRight,
  ExternalLink,
  Sparkles,
  User,
  Clock,
} from 'lucide-react';

export const KnowledgeArticlesPage: React.FC = () => {
  const { knowledgeArticles, rateKnowledgeArticle, toggleBookmarkArticle, addToast } = useApp();
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Selected article
  const [selectedArticleId, setSelectedArticleId] = useState<string>(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    return id || knowledgeArticles[0]?.id || 'art-1';
  });

  const categories = Array.from(new Set(knowledgeArticles.map((a) => a.category)));

  const filtered = knowledgeArticles.filter((art) => {
    const matchSearch =
      !search.trim() ||
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.description.toLowerCase().includes(search.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchCat = selectedCategory === 'All' || art.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const activeArticle =
    knowledgeArticles.find((a) => a.id === selectedArticleId) || knowledgeArticles[0];

  const handleCopy = () => {
    if (!activeArticle) return;
    navigator.clipboard.writeText(
      `${activeArticle.title}\n\n${activeArticle.description}\n\nTroubleshooting Steps:\n${activeArticle.steps.join('\n')}\n\nContent:\n${activeArticle.contentMarkdown}`
    );
    addToast('Copied', 'Knowledge article text copied to clipboard', 'info');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800">
            ENGINEERING RUNBOOKS & PLAYBOOKS
          </span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-400 font-semibold">{knowledgeArticles.length} Standard Operating Guides</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
          Operational Knowledge Articles & Playbooks
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Curated step-by-step diagnostic checklists and post-resolution playbooks for Tier-1 and Tier-2 engineers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Article Index (4 cols) */}
        <div className="lg:col-span-4 bg-[#0e1220] border border-[#1c243b] rounded-xl shadow-xl flex flex-col h-[700px] overflow-hidden">
          <div className="p-3.5 border-b border-[#1c243b] bg-[#0a0d18] space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search runbooks by title or tags..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-1 text-xs bg-[#121626] border border-[#1f2842] rounded-md text-slate-200 focus:outline-hidden"
            >
              <option value="All">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#161c2e] p-2 space-y-1">
            {filtered.map((art) => {
              const isSelected = art.id === selectedArticleId;
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticleId(art.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/60 border border-indigo-700/60 shadow-md'
                      : 'hover:bg-[#121626] border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{art.views} views</span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                    {art.title}
                  </h4>

                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <span>By <strong className="text-slate-300">{art.author}</strong></span>
                    <span className="text-emerald-400 font-semibold">{art.helpfulCount} helpful</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Article Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-[#0e1220] border border-[#1c243b] rounded-xl shadow-xl flex flex-col h-[700px] overflow-hidden">
          {activeArticle && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Article Header */}
              <div className="p-6 border-b border-[#1c243b] bg-[#0a0d18] space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950/80 text-cyan-300 border border-indigo-800">
                      {activeArticle.category}
                    </span>
                    <span className="text-xs text-slate-600">·</span>
                    <span className="text-xs text-slate-400">{activeArticle.department}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmarkArticle(activeArticle.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        activeArticle.bookmarked
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800/80'
                          : 'border-[#1f2842] bg-[#121626] text-slate-400 hover:text-white'
                      }`}
                      title="Bookmark Article"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg border border-[#1f2842] bg-[#121626] text-slate-400 hover:text-cyan-400 transition-colors"
                      title="Copy Article"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-white leading-snug">
                  {activeArticle.title}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeArticle.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#1c243b] text-[11px] text-slate-400">
                  <span>Author: <strong className="text-white">{activeArticle.author}</strong></span>
                  <span className="font-mono">Last Updated: {activeArticle.lastUpdated}</span>
                </div>
              </div>

              {/* Scrollable Article Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#090c14]">
                {/* Step-by-step troubleshooting checklist */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-cyan-400" />
                    <span>Step-by-Step Diagnostic Checklist</span>
                  </h3>
                  <div className="space-y-2">
                    {activeArticle.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#0e1220] border border-[#1c243b] flex items-start gap-3 text-xs"
                      >
                        <span className="w-5 h-5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/70 font-bold flex items-center justify-center shrink-0 text-[11px] font-mono">
                          {idx + 1}
                        </span>
                        <span className="text-slate-200 leading-relaxed font-sans">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Markdown content presentation */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>Technical Reference & Remediation Notes</span>
                  </h3>
                  <div className="p-4 rounded-xl bg-[#0a0d18] border border-[#1b233a] font-mono text-xs text-cyan-200/90 whitespace-pre-wrap leading-relaxed">
                    {activeArticle.contentMarkdown}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {activeArticle.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-[#161c2e] border border-[#232e4d] text-cyan-300 text-[11px] font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Related Incidents */}
                {activeArticle.relatedIncidents.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-[#0e1220] border border-[#1c243b] text-xs">
                    <span className="font-bold text-white block mb-1">
                      Related Historical Outages:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeArticle.relatedIncidents.map((tId) => (
                        <Link
                          key={tId}
                          to={`/incidents`}
                          className="font-mono text-cyan-400 hover:underline font-semibold"
                        >
                          {tId}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback Footer */}
              <div className="p-4 border-t border-[#1c243b] bg-[#0a0d18] flex items-center justify-between text-xs shrink-0">
                <span className="text-slate-400">
                  Was this runbook helpful for resolving your incident?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => rateKnowledgeArticle(activeArticle.id, true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-800/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 transition-colors font-medium"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Yes ({activeArticle.helpfulCount})</span>
                  </button>
                  <button
                    onClick={() => rateKnowledgeArticle(activeArticle.id, false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-800/60 bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 transition-colors font-medium"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>No ({activeArticle.notHelpfulCount})</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
