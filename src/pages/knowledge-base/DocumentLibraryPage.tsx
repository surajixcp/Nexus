import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KnowledgeDocument } from '../../types';
import { Modal } from '../../components/ui/Modal';
import {
  FolderLock,
  UploadCloud,
  FileText,
  Search,
  Filter,
  Trash2,
  RotateCw,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const DocumentLibraryPage: React.FC = () => {
  const { documents, uploadDocument, reindexDocument, deleteDocument, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Payment Engineering');
  const [uploadDepartment, setUploadDepartment] = useState('PayWave Engineering');
  const [uploadAuthor, setUploadAuthor] = useState('Alex Morgan');
  const [uploadFileType, setUploadFileType] = useState<'PDF' | 'DOCX' | 'TXT' | 'MD'>('PDF');
  const [uploadExcerpt, setUploadExcerpt] = useState('');
  const [uploadContent, setUploadContent] = useState('');

  // Drag and drop hover state
  const [isDragging, setIsDragging] = useState(false);

  const categories = Array.from(new Set(documents.map((d) => d.category)));

  const filtered = documents.filter((doc) => {
    const matchSearch =
      !search.trim() ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      doc.author.toLowerCase().includes(search.toLowerCase());

    const matchCat = categoryFilter === 'All' || doc.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    uploadDocument({
      title: uploadTitle,
      category: uploadCategory,
      department: uploadDepartment,
      author: uploadAuthor,
      fileType: uploadFileType,
      fileSize: '1.5 MB',
      pages: 12,
      excerpt: uploadExcerpt || 'Standard operational guidelines and technical runbook.',
      content: uploadContent || 'Detailed documentation body indexed for RAG retrieval.',
    });

    setUploadTitle('');
    setUploadExcerpt('');
    setUploadContent('');
    setUploadModalOpen(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadTitle('Uploaded-Runbook-2026.pdf');
    setUploadExcerpt('Uploaded runbook document for immediate vector indexing.');
    setUploadContent('Technical procedural steps automatically extracted from uploaded document.');
    setUploadModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800">
              DOCUMENT REPOSITORY & VECTOR INDEX
            </span>
            <span className="text-xs text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-semibold">{documents.length} Indexed Manuals</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Enterprise Document Library
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingest PDFs, runbooks, and SOP markdown files to power retrieval-augmented generation (RAG) across the incident workflow.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-lg shadow-md shadow-cyan-900/30 transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => setUploadModalOpen(true)}
        className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/30'
            : 'border-[#232e4d] bg-[#0e1220] hover:border-cyan-500/60'
        }`}
      >
        <div className="p-3 rounded-full bg-[#161c2e] border border-[#232e4d] text-cyan-400 mb-2">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h3 className="text-xs font-bold text-white">
          Drag & drop operational manuals or click to upload
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Supported file extensions: <strong className="text-cyan-300">PDF, DOCX, TXT, MD</strong> (Max 25 MB)
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by title, author, category..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-[#121626] border border-[#1f2842] rounded-md text-slate-200 focus:outline-hidden"
          >
            <option value="All">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="p-4 rounded-xl border border-[#1c243b] bg-[#0e1220] shadow-md hover:border-cyan-500/50 hover:bg-[#121626] transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#161c2e] text-cyan-300 border border-[#232e4d]">
                  {doc.fileType} · {doc.fileSize}
                </span>

                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                    doc.status === 'Indexed'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                      : doc.status === 'Processing'
                      ? 'bg-indigo-950/80 text-cyan-300 border-indigo-800/60 animate-pulse'
                      : 'bg-[#161c2e] text-slate-400 border-[#232e4d]'
                  }`}
                >
                  {doc.status === 'Indexed' ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <RotateCw className="w-3 h-3 animate-spin text-cyan-400" />
                  )}
                  {doc.status}
                </span>
              </div>

              <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                {doc.title}
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                {doc.excerpt}
              </p>
            </div>

            <div className="pt-3 border-t border-[#1c243b] flex items-center justify-between text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">{doc.department}</span>
                <span className="text-slate-300 font-medium">By {doc.author}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-[#161c2e] transition-colors"
                  title="Preview Document Content"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => reindexDocument(doc.id)}
                  className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-[#161c2e] transition-colors"
                  title="Re-index Vector Embeddings"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-[#161c2e] transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      <Modal
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.title || 'Document Inspection'}
        description={`Author: ${selectedDoc?.author} · ${selectedDoc?.department} · ${selectedDoc?.pages} Pages`}
        maxWidth="2xl"
      >
        {selectedDoc && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-[#161c2e] border border-[#232e4d] font-mono text-cyan-300">
                {selectedDoc.fileType} ({selectedDoc.fileSize})
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800 font-medium">
                Category: {selectedDoc.category}
              </span>
              <span className="text-slate-400 ml-auto">Uploaded: {selectedDoc.uploadDate}</span>
            </div>

            <div>
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Document Excerpt
              </h5>
              <p className="text-xs text-slate-300 p-3 rounded-lg bg-[#0a0d18] border border-[#1b233a] italic">
                "{selectedDoc.excerpt}"
              </p>
            </div>

            <div>
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Indexed Content & Standard Operating Protocol
              </h5>
              <div className="p-4 rounded-xl bg-[#090c14] border border-[#1b233a] font-mono text-xs text-cyan-200/90 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                {selectedDoc.content}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1c243b]">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#121626] border border-[#1f2842] rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload & Index Enterprise Document"
        description="Add a runbook or troubleshooting manual to the vector retrieval index."
        maxWidth="lg"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Document Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g., SOP-701: Core Banking Failover Runbook 2026"
              className="w-full px-3 py-2 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                File Type
              </label>
              <select
                value={uploadFileType}
                onChange={(e) => setUploadFileType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white focus:outline-hidden"
              >
                <option value="PDF">PDF Document</option>
                <option value="DOCX">Microsoft Word (DOCX)</option>
                <option value="MD">Markdown (MD)</option>
                <option value="TXT">Plain Text (TXT)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Brief Excerpt / Summary
            </label>
            <input
              type="text"
              value={uploadExcerpt}
              onChange={(e) => setUploadExcerpt(e.target.value)}
              placeholder="Summary of what this document covers..."
              className="w-full px-3 py-2 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Document Text / Markdown
            </label>
            <textarea
              rows={4}
              value={uploadContent}
              onChange={(e) => setUploadContent(e.target.value)}
              placeholder="Paste content of the runbook or procedures..."
              className="w-full px-3 py-2 text-xs font-mono bg-[#121626] border border-[#1f2842] rounded-lg text-white focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1c243b]">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-lg shadow-md shadow-cyan-900/30"
            >
              Upload & Vectorize
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
