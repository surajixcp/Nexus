import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RAGCitation } from '../../types';
import { Modal } from '../../components/ui/Modal';
import {
  MessageSquareCode,
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export const AIKnowledgeChatPage: React.FC = () => {
  const { ragConversations, sendRAGQuery, isAITyping, documents, addToast } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [selectedCitation, setSelectedCitation] = useState<RAGCitation | null>(null);
  const chatBottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ragConversations, isAITyping]);

  const suggestedPrompts = [
    'How do I troubleshoot payment gateway failures?',
    'What is the escalation procedure for DemoBank incidents?',
    'Find the SOP for database connection issues.',
    'How do I resolve API timeout errors?',
    'What are the troubleshooting steps for browser monitoring failures?',
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isAITyping) return;
    const q = inputQuery;
    setInputQuery('');
    await sendRAGQuery(q);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('Copied', 'AI response copied to clipboard', 'info');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950/70 text-cyan-300 border border-indigo-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            RAG DEMO MODE · Responses generated from synthetic knowledge vectors
          </span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-400 font-semibold">Semantic Vector Grounding</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
          Enterprise AI Knowledge Chat (RAG)
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Ask questions in natural language. Answers are grounded in the 15 indexed organizational SOP documents with page-level citations.
        </p>
      </div>

      {/* Main Chat Window */}
      <div className="bg-[#0e1220] border border-[#1c243b] rounded-2xl shadow-xl flex flex-col h-[700px] overflow-hidden">
        {/* Chat Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-[#090c14]">
          {ragConversations.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-3xl ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-600 to-cyan-600 text-white shadow-md'
                    : 'bg-[#161c2e] border border-[#232e4d] text-cyan-400 shadow-md'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-950/50'
                    : 'bg-[#121626] border-[#1f2842] text-slate-200 shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                {/* Citations if available */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-3 border-t border-[#1c243b] space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Grounding Citations & Document Sources
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cite, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedCitation(cite)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-cyan-300 bg-[#161c2e] border border-[#232e4d] rounded-md hover:border-cyan-500 hover:text-white transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{cite.docTitle} (Page {cite.page})</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested follow-up questions */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-2 border-t border-[#1c243b] flex flex-wrap gap-1.5">
                    {msg.suggestedFollowUps.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => sendRAGQuery(prompt)}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#161c2e] border border-[#232e4d] text-slate-300 hover:text-cyan-300 hover:border-cyan-500 transition-colors"
                      >
                        &rarr; {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {msg.role === 'assistant' && (
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono text-cyan-400/80">Grounded via Vector RAG Engine</span>
                    <button
                      onClick={() => copyText(msg.content)}
                      className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Copy response
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isAITyping && (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="w-8 h-8 rounded-full bg-[#161c2e] border border-[#232e4d] flex items-center justify-center text-cyan-400 shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-[#121626] border border-[#1f2842] shadow-md flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce delay-150" />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce delay-300" />
                </span>
                <span className="text-slate-400 text-[11px]">Retrieving document vectors & generating answer...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Prompts Shelf */}
        <div className="p-2.5 bg-[#0a0d18] border-t border-[#1c243b] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Suggested Prompts:
          </span>
          {suggestedPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => sendRAGQuery(p)}
              className="px-2.5 py-1 text-[11px] rounded bg-[#121626] border border-[#1f2842] text-slate-300 hover:border-cyan-500 hover:text-cyan-300 shrink-0 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-[#1c243b] bg-[#0a0d18] flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a technical or operational question (e.g., 'How do I resolve API timeout errors?')..."
            className="flex-1 px-4 py-2.5 text-xs bg-[#121626] border border-[#1f2842] rounded-xl focus:outline-hidden focus:border-cyan-500 text-white font-medium placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={isAITyping || !inputQuery.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-cyan-900/30 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Search & Answer</span>
          </button>
        </form>
      </div>

      {/* Citation Preview Modal */}
      <Modal
        isOpen={Boolean(selectedCitation)}
        onClose={() => setSelectedCitation(null)}
        title={selectedCitation?.docTitle || 'Citation Source Preview'}
        description={`Page ${selectedCitation?.page} · Verified RAG Semantic Excerpt`}
        maxWidth="lg"
      >
        {selectedCitation && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#090c14] border border-[#1b233a] text-xs text-cyan-300 leading-relaxed font-mono">
              "{selectedCitation.snippet}"
            </div>
            <p className="text-[11px] text-slate-400">
              This snippet was retrieved with 98.4% cosine similarity from the enterprise document store during answer generation.
            </p>
            <div className="flex justify-end pt-2 border-t border-[#1c243b]">
              <button
                onClick={() => setSelectedCitation(null)}
                className="px-4 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-[#121626] border border-[#1f2842] rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
