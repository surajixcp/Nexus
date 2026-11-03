import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Incident } from '../../types';
import { Modal } from '../ui/Modal';
import { CheckCircle2, Sparkles, BookPlus } from 'lucide-react';

interface ResolveIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
}

export const ResolveIncidentModal: React.FC<ResolveIncidentModalProps> = ({
  isOpen,
  onClose,
  incident,
}) => {
  const { resolveIncident } = useApp();

  const [resolutionNotes, setResolutionNotes] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [createArticle, setCreateArticle] = useState(true);

  if (!incident) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) return;

    resolveIncident(incident.id, resolutionNotes, rootCause, createArticle);
    setResolutionNotes('');
    setRootCause('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Resolve Incident: ${incident.ticketId}`}
      description="Record resolution procedure, root cause analysis, and optionally generate an enterprise knowledge article."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Incident Title
          </label>
          <div className="p-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200">
            {incident.title} ({incident.application} · {incident.service})
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Root Cause Analysis (RCA) <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            placeholder="Describe the underlying technical root cause (e.g., deadlock between concurrent jobs, memory leak in cache, upstream network fiber cut)..."
            className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Resolution Steps & Workaround <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="Detailed step-by-step remediation executed by support engineering..."
            className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
        </div>

        {/* Create Knowledge Article Checkbox */}
        <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex items-start gap-3">
          <input
            type="checkbox"
            id="createArticleCheckbox"
            checked={createArticle}
            onChange={(e) => setCreateArticle(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="createArticleCheckbox" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <span className="font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400">
              <BookPlus className="w-3.5 h-3.5" />
              Create Knowledge Article from Resolution
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Automatically indexes this resolution into the RAG Knowledge Hub for future AI troubleshooting queries.
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirm Resolution
          </button>
        </div>
      </form>
    </Modal>
  );
};
