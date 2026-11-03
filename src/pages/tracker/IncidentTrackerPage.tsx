import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TrackerRecord, Severity } from '../../types';
import { SeverityBadge } from '../../components/ui/Badge';
import { TrackerDetailsDrawer } from '../../components/tracker/TrackerDetailsDrawer';
import { Modal } from '../../components/ui/Modal';
import {
  TableProperties,
  Search,
  Filter,
  Download,
  Printer,
  Plus,
  Eye,
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Columns,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  formatDuration,
  calculateDurationMinutes,
  formatProblemId,
  isSlaBreached,
} from '../../utils/calculations';

export const IncidentTrackerPage: React.FC = () => {
  const {
    trackerRecords,
    applications,
    createTrackerRecord,
    updateTrackerRecord,
    deleteTrackerRecord,
    addToast,
    currentUser,
  } = useApp();

  // Search & Filters
  const [search, setSearch] = useState('');
  const [appFilter, setAppFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ackFilter, setAckFilter] = useState('All');

  // Sorting
  const [sortField, setSortField] = useState<keyof TrackerRecord>('srNo');
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Selected for Details Drawer
  const [selectedRecord, setSelectedRecord] = useState<TrackerRecord | null>(null);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeEditingRecord, setActiveEditingRecord] = useState<TrackerRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<TrackerRecord | null>(null);

  // Column Visibility state for all 24 columns
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    srNo: true,
    application: true,
    severity: true,
    problemId: true,
    alertDescription: true,
    impactedEntity: true,
    startDate: true,
    startTime: true,
    reportedDate: true,
    reportedTime: true,
    endDate: true,
    endTime: true,
    durationFormatted: true,
    reportedDurationFormatted: true,
    escalationDetails: true,
    acknowledgementReceived: true,
    reportedBy: true,
    troubleshootingNotes: true,
    supportResponse: true,
    resolutionSteps: true,
    startDateTime: true,
    reportedDateTime: true,
    endDateTime: true,
    durationMinutes: true,
  });

  const [colMenuOpen, setColMenuOpen] = useState(false);

  // Form State for Create/Edit Modal
  const [formData, setFormData] = useState<Partial<TrackerRecord>>({
    application: 'DemoBank Core',
    severity: 'Medium',
    alertDescription: '',
    impactedEntity: '',
    startDate: new Date().toISOString().slice(0, 10),
    startTime: new Date().toISOString().slice(11, 19),
    reportedDate: new Date().toISOString().slice(0, 10),
    reportedTime: new Date().toISOString().slice(11, 19),
    endDate: '',
    endTime: '',
    escalationDetails: 'Direct Operational Log',
    acknowledgementReceived: 'Yes',
    reportedBy: currentUser.name,
    troubleshootingNotes: '',
    supportResponse: '',
    resolutionSteps: '',
  });

  // KPI Calculations
  const totalTracked = trackerRecords.length;
  const activeTracked = trackerRecords.filter((t) => t.status === 'Active').length;
  const resolvedTrackers = trackerRecords.filter((t) => t.status === 'Resolved');
  const resolvedCount = resolvedTrackers.length;

  const avgIncidentDuration = resolvedTrackers.length
    ? Math.round(resolvedTrackers.reduce((acc, t) => acc + t.durationMinutes, 0) / resolvedTrackers.length)
    : 78;

  const avgMttr = resolvedTrackers.length
    ? Math.round(resolvedTrackers.reduce((acc, t) => acc + t.reportedDurationMinutes, 0) / resolvedTrackers.length)
    : 74;

  const slaBreachedCount = trackerRecords.filter((t) => isSlaBreached(t.durationMinutes, t.severity)).length;

  // Filtering
  const filtered = useMemo(() => {
    return trackerRecords.filter((r) => {
      const matchSearch =
        !search.trim() ||
        r.problemId.toLowerCase().includes(search.toLowerCase()) ||
        r.alertDescription.toLowerCase().includes(search.toLowerCase()) ||
        r.application.toLowerCase().includes(search.toLowerCase()) ||
        r.impactedEntity.toLowerCase().includes(search.toLowerCase()) ||
        r.reportedBy.toLowerCase().includes(search.toLowerCase());

      const matchApp = appFilter === 'All' || r.application === appFilter;
      const matchSeverity = severityFilter === 'All' || r.severity === severityFilter;
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      const matchAck = ackFilter === 'All' || r.acknowledgementReceived === ackFilter;

      return matchSearch && matchApp && matchSeverity && matchStatus && matchAck;
    });
  }, [trackerRecords, search, appFilter, severityFilter, statusFilter, ackFilter]);

  // Sorting
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      const strA = String(valA || '');
      const strB = String(valB || '');
      return sortAsc ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filtered, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage]);

  const handleSort = (field: keyof TrackerRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Create submission
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTrackerRecord(formData);
    setCreateModalOpen(false);
  };

  // Edit submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEditingRecord) return;
    updateTrackerRecord(activeEditingRecord.srNo, formData);
    setEditModalOpen(false);
  };

  const openEditModal = (rec: TrackerRecord) => {
    setActiveEditingRecord(rec);
    setFormData({ ...rec });
    setEditModalOpen(true);
  };

  const openDeleteModal = (rec: TrackerRecord) => {
    setRecordToDelete(rec);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      deleteTrackerRecord(recordToDelete.srNo);
      setDeleteModalOpen(false);
      setRecordToDelete(null);
    }
  };

  // CSV Export
  const exportTrackerCSV = () => {
    const headers = [
      'Sr. No.',
      'Application',
      'Severity',
      'Problem ID',
      'Alert Description',
      'Impacted Entity',
      'Start Date',
      'Start Time',
      'Reported Date',
      'Reported Time',
      'End Date',
      'End Time',
      'Duration (End - Start)',
      'Reported Duration / MTTR (End - Reported)',
      'Escalation Details',
      'Acknowledgement Received (Yes / No)',
      'Reported By',
      'Troubleshooting / Analysis (Shared with Support Team)',
      'Response from Support Team',
      'Resolution Steps',
      'Start Date Time',
      'Reported Date Time',
      'End Date Time',
      'Duration in Minutes',
    ];

    const rows = filtered.map((r) => [
      r.srNo,
      r.application,
      r.severity,
      r.problemId,
      `"${r.alertDescription.replace(/"/g, '""')}"`,
      r.impactedEntity,
      r.startDate,
      r.startTime,
      r.reportedDate,
      r.reportedTime,
      r.endDate,
      r.endTime,
      `"${formatDuration(r.durationMinutes)}"`,
      `"${formatDuration(r.reportedDurationMinutes)}"`,
      `"${r.escalationDetails.replace(/"/g, '""')}"`,
      r.acknowledgementReceived,
      `"${r.reportedBy.replace(/"/g, '""')}"`,
      `"${r.troubleshootingNotes.replace(/"/g, '""')}"`,
      `"${r.supportResponse.replace(/"/g, '""')}"`,
      `"${r.resolutionSteps.replace(/"/g, '""')}"`,
      r.startDateTime,
      r.reportedDateTime,
      r.endDateTime,
      r.durationMinutes,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexus_tracker_master_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Tracker CSV Exported', `Exported ${filtered.length} rows with 24 columns`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-full space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/80">
              EXCEL-GRADE OPERATIONAL TRACKER
            </span>
            <span className="text-xs text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-semibold">24 Columns Full Structure</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Enterprise Incident Tracker Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Spreadsheet-inspired operational log with dynamic duration math (End − Start), reported MTTR, acknowledgement tracking, and support responses.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#121626] border border-[#1f2842] hover:bg-[#181d33] rounded-lg shadow-md transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print View</span>
          </button>
          <button
            onClick={exportTrackerCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#121626] border border-[#1f2842] hover:bg-[#181d33] rounded-lg shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-lg shadow-md shadow-cyan-900/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Tracker Record</span>
          </button>
        </div>
      </div>

      {/* Tracker Dashboard KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Tracked</span>
          <p className="text-xl font-black text-white font-mono mt-1">{totalTracked}</p>
          <span className="text-[10px] text-slate-400">24-column logs</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Active Incidents</span>
          <p className="text-xl font-black text-amber-300 font-mono mt-1">{activeTracked}</p>
          <span className="text-[10px] text-slate-400">ongoing investigations</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Resolved</span>
          <p className="text-xl font-black text-emerald-300 font-mono mt-1">{resolvedCount}</p>
          <span className="text-[10px] text-slate-400">end times recorded</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Duration</span>
          <p className="text-xl font-black text-white font-mono mt-1">{formatDuration(avgIncidentDuration)}</p>
          <span className="text-[10px] text-cyan-400">End − Start</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Reported MTTR</span>
          <p className="text-xl font-black text-cyan-300 font-mono mt-1">{formatDuration(avgMttr)}</p>
          <span className="text-[10px] text-slate-400">End − Reported</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#140f1a] border border-rose-500/40 shadow-xl shadow-rose-950/20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">SLA Breaches</span>
          <p className="text-xl font-black text-rose-300 font-mono mt-1">{slaBreachedCount}</p>
          <span className="text-[10px] text-rose-300 font-medium">duration &gt; threshold</span>
        </div>
      </div>

      {/* Search, Filter & Column Customizer Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Problem ID (e.g., DEMO-P-2610001), alert description, host, reporter..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#121626] border border-[#1f2842] rounded-xl focus:outline-hidden focus:border-cyan-500 text-white placeholder-slate-500 transition-colors"
            />
          </div>

          {/* Column Visibility Toggle Button */}
          <div className="relative shrink-0">
            <button
              onClick={() => setColMenuOpen(!colMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-[#121626] border border-[#1f2842] rounded-xl hover:text-white hover:border-cyan-500/40 transition-colors"
            >
              <Columns className="w-3.5 h-3.5 text-cyan-400" />
              <span>Columns</span>
            </button>

            {colMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-3 z-50 max-h-80 overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Toggle Columns
                  </span>
                  <button
                    onClick={() => {
                      const allVisible: Record<string, boolean> = {};
                      Object.keys(visibleColumns).forEach((k) => (allVisible[k] = true));
                      setVisibleColumns(allVisible);
                    }}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Select All
                  </button>
                </div>
                <div className="space-y-1 text-xs">
                  {Object.keys(visibleColumns).map((colKey) => (
                    <label key={colKey} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={visibleColumns[colKey]}
                        onChange={(e) =>
                          setVisibleColumns((prev) => ({ ...prev, [colKey]: e.target.checked }))
                        }
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-slate-700 dark:text-slate-300 capitalize">
                        {colKey.replace(/([A-Z])/g, ' $1')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Application
            </label>
            <select
              value={appFilter}
              onChange={(e) => {
                setAppFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md dark:text-white"
            >
              <option value="All">All Applications</option>
              {applications.map((app) => (
                <option key={app.id} value={app.name}>
                  {app.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Severity
            </label>
            <select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-[#121626] border border-[#1f2842] rounded-xl text-xs text-white focus:outline-hidden focus:border-cyan-500"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-[#121626] border border-[#1f2842] rounded-xl text-xs text-white focus:outline-hidden focus:border-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active / In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Acknowledgement
            </label>
            <select
              value={ackFilter}
              onChange={(e) => {
                setAckFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-[#121626] border border-[#1f2842] rounded-xl text-xs text-white focus:outline-hidden focus:border-cyan-500"
            >
              <option value="All">All (Yes / No)</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* 24-Column Horizontally Scrollable Spreadsheet Table */}
      <div className="bg-[#0e1220] rounded-2xl border border-[#1c243b] shadow-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[640px] relative">
          <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
            <thead className="sticky top-0 z-20 bg-[#0a0d18] border-b border-[#1b233a] text-slate-400 font-semibold shadow-xs select-none">
              <tr>
                <th className="py-3 px-3 sticky left-0 z-30 bg-[#0a0d18] border-r border-[#1b233a] text-slate-300">
                  Actions
                </th>
                {visibleColumns.srNo && (
                  <th onClick={() => handleSort('srNo')} className="py-3 px-3 cursor-pointer hover:text-white transition-colors">
                    1. Sr. No.
                  </th>
                )}
                {visibleColumns.application && (
                  <th onClick={() => handleSort('application')} className="py-2.5 px-3 cursor-pointer hover:text-slate-900">
                    2. Application
                  </th>
                )}
                {visibleColumns.severity && (
                  <th onClick={() => handleSort('severity')} className="py-2.5 px-3 cursor-pointer hover:text-slate-900">
                    3. Severity
                  </th>
                )}
                {visibleColumns.problemId && (
                  <th onClick={() => handleSort('problemId')} className="py-2.5 px-3 cursor-pointer hover:text-slate-900">
                    4. Problem ID
                  </th>
                )}
                {visibleColumns.alertDescription && (
                  <th className="py-2.5 px-3 min-w-[260px]">5. Alert Description</th>
                )}
                {visibleColumns.impactedEntity && (
                  <th className="py-2.5 px-3">6. Impacted Entity</th>
                )}
                {visibleColumns.startDate && <th className="py-2.5 px-3">7. Start Date</th>}
                {visibleColumns.startTime && <th className="py-2.5 px-3">8. Start Time</th>}
                {visibleColumns.reportedDate && <th className="py-2.5 px-3">9. Reported Date</th>}
                {visibleColumns.reportedTime && <th className="py-2.5 px-3">10. Reported Time</th>}
                {visibleColumns.endDate && <th className="py-2.5 px-3">11. End Date</th>}
                {visibleColumns.endTime && <th className="py-2.5 px-3">12. End Time</th>}
                {visibleColumns.durationFormatted && (
                  <th className="py-2.5 px-3 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 font-bold">
                    13. Duration (End − Start)
                  </th>
                )}
                {visibleColumns.reportedDurationFormatted && (
                  <th className="py-2.5 px-3 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 font-bold">
                    14. Reported Duration / MTTR
                  </th>
                )}
                {visibleColumns.escalationDetails && (
                  <th className="py-2.5 px-3 min-w-[220px]">15. Escalation Details</th>
                )}
                {visibleColumns.acknowledgementReceived && (
                  <th className="py-2.5 px-3">16. Ack Received</th>
                )}
                {visibleColumns.reportedBy && <th className="py-2.5 px-3">17. Reported By</th>}
                {visibleColumns.troubleshootingNotes && (
                  <th className="py-2.5 px-3 min-w-[280px]">18. Troubleshooting / Analysis</th>
                )}
                {visibleColumns.supportResponse && (
                  <th className="py-2.5 px-3 min-w-[260px]">19. Response from Support Team</th>
                )}
                {visibleColumns.resolutionSteps && (
                  <th className="py-2.5 px-3 min-w-[280px]">20. Resolution Steps</th>
                )}
                {visibleColumns.startDateTime && <th className="py-2.5 px-3">21. Start Date Time</th>}
                {visibleColumns.reportedDateTime && <th className="py-2.5 px-3">22. Reported Date Time</th>}
                {visibleColumns.endDateTime && <th className="py-2.5 px-3">23. End Date Time</th>}
                {visibleColumns.durationMinutes && (
                  <th className="py-2.5 px-3 font-mono">24. Duration (Mins)</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={25} className="py-12 text-center text-slate-400">
                    No tracker rows match your search query.
                  </td>
                </tr>
              ) : (
                paginated.map((rec) => (
                  <tr
                    key={rec.srNo}
                    onClick={() => setSelectedRecord(rec)}
                    className="hover:bg-[#121626] border-b border-[#151c2e] cursor-pointer transition-colors group"
                  >
                    {/* Fixed Action column */}
                    <td
                      className="py-2.5 px-3 sticky left-0 z-10 bg-[#0c0f1c] group-hover:bg-[#121626] border-r border-[#1b233a]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedRecord(rec)}
                          className="p-1 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-[#181f33] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(rec)}
                          className="p-1 rounded-md text-slate-400 hover:text-amber-400 hover:bg-[#181f33] transition-colors"
                          title="Edit Row"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(rec)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-[#181f33] transition-colors"
                          title="Delete Row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* 1. Sr. No. */}
                    {visibleColumns.srNo && (
                      <td className="py-2 px-3 font-mono text-slate-400">{rec.srNo}</td>
                    )}

                    {/* 2. Application */}
                    {visibleColumns.application && (
                      <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {rec.application}
                      </td>
                    )}

                    {/* 3. Severity */}
                    {visibleColumns.severity && (
                      <td className="py-2 px-3">
                        <SeverityBadge severity={rec.severity} size="sm" />
                      </td>
                    )}

                    {/* 4. Problem ID */}
                    {visibleColumns.problemId && (
                      <td className="py-2 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                        {rec.problemId}
                      </td>
                    )}

                    {/* 5. Alert Description */}
                    {visibleColumns.alertDescription && (
                      <td className="py-2 px-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {rec.alertDescription}
                      </td>
                    )}

                    {/* 6. Impacted Entity */}
                    {visibleColumns.impactedEntity && (
                      <td className="py-2 px-3 font-mono text-slate-500">{rec.impactedEntity}</td>
                    )}

                    {/* 7. Start Date */}
                    {visibleColumns.startDate && <td className="py-2 px-3">{rec.startDate}</td>}

                    {/* 8. Start Time */}
                    {visibleColumns.startTime && (
                      <td className="py-2 px-3 font-mono">{rec.startTime}</td>
                    )}

                    {/* 9. Reported Date */}
                    {visibleColumns.reportedDate && <td className="py-2 px-3">{rec.reportedDate}</td>}

                    {/* 10. Reported Time */}
                    {visibleColumns.reportedTime && (
                      <td className="py-2 px-3 font-mono">{rec.reportedTime}</td>
                    )}

                    {/* 11. End Date */}
                    {visibleColumns.endDate && (
                      <td className="py-2 px-3 text-slate-500">
                        {rec.endDate || <span className="text-amber-500 font-medium italic">Active</span>}
                      </td>
                    )}

                    {/* 12. End Time */}
                    {visibleColumns.endTime && (
                      <td className="py-2 px-3 font-mono text-slate-500">
                        {rec.endTime || <span className="text-amber-500 font-medium italic">Active</span>}
                      </td>
                    )}

                    {/* 13. Duration (End - Start) */}
                    {visibleColumns.durationFormatted && (
                      <td className="py-2 px-3 font-mono font-bold bg-indigo-50/30 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400">
                        {formatDuration(rec.durationMinutes)}
                      </td>
                    )}

                    {/* 14. Reported Duration / MTTR */}
                    {visibleColumns.reportedDurationFormatted && (
                      <td className="py-2 px-3 font-mono font-bold bg-indigo-50/30 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400">
                        {formatDuration(rec.reportedDurationMinutes)}
                      </td>
                    )}

                    {/* 15. Escalation Details */}
                    {visibleColumns.escalationDetails && (
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {rec.escalationDetails}
                      </td>
                    )}

                    {/* 16. Acknowledgement Received */}
                    {visibleColumns.acknowledgementReceived && (
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rec.acknowledgementReceived === 'Yes'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300'
                          }`}
                        >
                          {rec.acknowledgementReceived}
                        </span>
                      </td>
                    )}

                    {/* 17. Reported By */}
                    {visibleColumns.reportedBy && (
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{rec.reportedBy}</td>
                    )}

                    {/* 18. Troubleshooting / Analysis */}
                    {visibleColumns.troubleshootingNotes && (
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400 max-w-sm truncate font-mono">
                        {rec.troubleshootingNotes}
                      </td>
                    )}

                    {/* 19. Response from Support Team */}
                    {visibleColumns.supportResponse && (
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {rec.supportResponse}
                      </td>
                    )}

                    {/* 20. Resolution Steps */}
                    {visibleColumns.resolutionSteps && (
                      <td className="py-2 px-3 text-emerald-700 dark:text-emerald-400 max-w-xs truncate font-mono">
                        {rec.resolutionSteps || <span className="text-slate-400 italic">In progress</span>}
                      </td>
                    )}

                    {/* 21. Start Date Time */}
                    {visibleColumns.startDateTime && (
                      <td className="py-2 px-3 text-slate-500 font-mono">{rec.startDateTime}</td>
                    )}

                    {/* 22. Reported Date Time */}
                    {visibleColumns.reportedDateTime && (
                      <td className="py-2 px-3 text-slate-500 font-mono">{rec.reportedDateTime}</td>
                    )}

                    {/* 23. End Date Time */}
                    {visibleColumns.endDateTime && (
                      <td className="py-2 px-3 text-slate-500 font-mono">
                        {rec.endDateTime === 'Active / In Progress' ? (
                          <span className="text-amber-500 font-medium italic">Active / In Progress</span>
                        ) : (
                          rec.endDateTime
                        )}
                      </td>
                    )}

                    {/* 24. Duration in Minutes */}
                    {visibleColumns.durationMinutes && (
                      <td className="py-2 px-3 font-mono text-right text-slate-700 dark:text-slate-300">
                        {rec.durationMinutes}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between p-3.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div>
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * pageSize, sorted.length)}</strong> of <strong>{sorted.length}</strong> records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tracker Details Drawer */}
      <TrackerDetailsDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* Create Tracker Record Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add Operational Tracker Record"
        description="Insert new operational problem row directly into the 24-column matrix."
        maxWidth="xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Application
              </label>
              <select
                value={formData.application}
                onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md dark:text-white"
              >
                {applications.map((app) => (
                  <option key={app.id} value={app.name}>{app.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Severity
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as Severity })}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md dark:text-white"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Alert Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.alertDescription}
              onChange={(e) => setFormData({ ...formData, alertDescription: e.target.value })}
              placeholder="Operational symptom, alert name, or exception description..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Impacted Entity
              </label>
              <input
                type="text"
                value={formData.impactedEntity}
                onChange={(e) => setFormData({ ...formData, impactedEntity: e.target.value })}
                placeholder="e.g., node-01.database.prod"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Acknowledgement Received
              </label>
              <select
                value={formData.acknowledgementReceived}
                onChange={(e) => setFormData({ ...formData, acknowledgementReceived: e.target.value as 'Yes' | 'No' })}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md dark:text-white"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400">Start Time</label>
              <input
                type="time"
                step="1"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400">End Time</label>
              <input
                type="time"
                step="1"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Troubleshooting Notes
            </label>
            <textarea
              rows={2}
              value={formData.troubleshootingNotes}
              onChange={(e) => setFormData({ ...formData, troubleshootingNotes: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Save Tracker Row
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Tracker Record Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Tracker Record #${activeEditingRecord?.srNo} (${activeEditingRecord?.problemId})`}
        description="Update operational columns and recalculate duration metrics."
        maxWidth="xl"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Alert Description
            </label>
            <input
              type="text"
              required
              value={formData.alertDescription}
              onChange={(e) => setFormData({ ...formData, alertDescription: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Date (Leave blank if active)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                step="1"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Resolution Steps
            </label>
            <textarea
              rows={3}
              value={formData.resolutionSteps}
              onChange={(e) => setFormData({ ...formData, resolutionSteps: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Update Record
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Tracker Record"
        description="Are you sure you want to remove this record from the tracker matrix?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Delete Record <strong>#{recordToDelete?.srNo} ({recordToDelete?.problemId})</strong>: {recordToDelete?.alertDescription}
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Delete Row
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
