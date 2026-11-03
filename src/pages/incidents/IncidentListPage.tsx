import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Incident, Severity, Priority, IncidentStatus } from '../../types';
import { SeverityBadge, PriorityBadge, StatusBadge } from '../../components/ui/Badge';
import { IncidentDetailsDrawer } from '../../components/incidents/IncidentDetailsDrawer';
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  Plus,
  Clock,
  CheckCircle,
  Flame,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { formatSlaCountdown } from '../../utils/calculations';
import { Link } from 'react-router-dom';

export const IncidentListPage: React.FC = () => {
  const { incidents, applications, updateIncident, addToast } = useApp();
  const location = useLocation();

  // Search and filter state
  const [search, setSearch] = useState('');
  const [appFilter, setAppFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Sorting state
  const [sortField, setSortField] = useState<'ticketId' | 'createdAt' | 'severity' | 'status'>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected incident for drawer
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      return incidents.find((i) => i.id === id) || null;
    }
    return null;
  });

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtering
  const filtered = useMemo(() => {
    return incidents.filter((inc) => {
      const matchSearch =
        !search.trim() ||
        inc.ticketId.toLowerCase().includes(search.toLowerCase()) ||
        inc.title.toLowerCase().includes(search.toLowerCase()) ||
        inc.description.toLowerCase().includes(search.toLowerCase()) ||
        inc.impactedEntity.toLowerCase().includes(search.toLowerCase());

      const matchApp = appFilter === 'All' || inc.application === appFilter;
      const matchStatus = statusFilter === 'All' || inc.status === statusFilter;
      const matchSeverity = severityFilter === 'All' || inc.severity === severityFilter;
      const matchPriority = priorityFilter === 'All' || inc.priority === priorityFilter;

      return matchSearch && matchApp && matchStatus && matchSeverity && matchPriority;
    });
  }, [incidents, search, appFilter, statusFilter, severityFilter, priorityFilter]);

  // Sorting
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let comp = 0;
      if (sortField === 'ticketId') {
        comp = a.ticketId.localeCompare(b.ticketId);
      } else if (sortField === 'createdAt') {
        comp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === 'severity') {
        const order: Record<Severity, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        comp = (order[a.severity] || 0) - (order[b.severity] || 0);
      } else if (sortField === 'status') {
        comp = a.status.localeCompare(b.status);
      }
      return sortAsc ? comp : -comp;
    });
  }, [filtered, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginated.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleBulkAcknowledge = () => {
    selectedIds.forEach((id) => {
      updateIncident(id, { status: 'Acknowledged', acknowledgedAt: new Date().toISOString() });
    });
    addToast('Bulk Updated', `${selectedIds.length} incidents marked as Acknowledged`, 'success');
    setSelectedIds([]);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Ticket ID',
      'Title',
      'Application',
      'Service',
      'Severity',
      'Priority',
      'Status',
      'Assigned Team',
      'Reporter',
      'Created At',
      'Impacted Entity',
    ];
    const rows = filtered.map((i) => [
      i.ticketId,
      `"${i.title.replace(/"/g, '""')}"`,
      i.application,
      i.service,
      i.severity,
      i.priority,
      i.status,
      i.assignedTeam,
      i.reporter.name,
      i.createdAt,
      i.impactedEntity,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexus_incidents_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Export Generated', `Exported ${filtered.length} incidents to CSV`, 'success');
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Enterprise Incident Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational triage, severity classification, support routing, and lifecycle transitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-lg shadow-2xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <Link
            to="/create-incident"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Incident</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ticket ID, summary, host, or error details..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#121626] border border-[#1f2842] rounded-xl focus:outline-hidden focus:border-cyan-500 text-white placeholder-slate-500 transition-colors"
            />
          </div>

          {/* Bulk actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                {selectedIds.length} selected
              </span>
              <button
                onClick={handleBulkAcknowledge}
                className="px-2.5 py-1 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
              >
                Bulk Acknowledge
              </button>
            </div>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Application */}
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
              className="w-full px-3 py-2 bg-[#121626] border border-[#1f2842] rounded-xl text-xs text-white focus:outline-hidden focus:border-cyan-500"
            >
              <option value="All">All Applications</option>
              {applications.map((app) => (
                <option key={app.id} value={app.name}>
                  {app.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
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
              <option value="Open">Open</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="In Progress">In Progress</option>
              <option value="Escalated">Escalated</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Severity */}
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

          {/* Priority */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-[#121626] border border-[#1f2842] rounded-xl text-xs text-white focus:outline-hidden focus:border-cyan-500"
            >
              <option value="All">All Priorities</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
              <option value="P4">P4</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#0e1220] rounded-2xl border border-[#1c243b] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0a0d18] border-b border-[#1b233a] text-slate-400 font-semibold select-none">
                <th className="py-3.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selectedIds.length === paginated.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-[#252f4a] bg-[#121626] text-cyan-500 focus:ring-cyan-500"
                  />
                </th>
                <th
                  onClick={() => toggleSort('ticketId')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Ticket ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Title & Summary</th>
                <th className="py-3 px-3">Application / Service</th>
                <th
                  onClick={() => toggleSort('severity')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Severity</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Priority</th>
                <th
                  onClick={() => toggleSort('status')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Assigned Team</th>
                <th
                  onClick={() => toggleSort('createdAt')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Created Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">SLA Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    No incidents match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((inc) => {
                  const elapsed = Math.max(0, Math.round((Date.now() - new Date(inc.createdAt).getTime()) / 60000));
                  const sla = formatSlaCountdown(elapsed, inc.severity);

                  return (
                    <tr
                      key={inc.id}
                      onClick={() => setSelectedIncident(inc)}
                      className="hover:bg-[#121626] border-b border-[#151c2e] cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(inc.id)}
                          onChange={(e) => handleSelectOne(inc.id, e.target.checked)}
                          className="rounded border-[#252f4a] bg-[#121626] text-cyan-500 focus:ring-cyan-500"
                        />
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        {inc.ticketId}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white max-w-xs truncate group-hover:text-cyan-200 transition-colors">
                        {inc.title}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-200 block">
                          {inc.application}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">{inc.service}</span>
                      </td>
                      <td className="py-3 px-3">
                        <SeverityBadge severity={inc.severity} size="sm" />
                      </td>
                      <td className="py-3 px-3">
                        <PriorityBadge priority={inc.priority} />
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={inc.status} />
                      </td>
                      <td className="py-3 px-3 text-slate-300 max-w-[140px] truncate">
                        {inc.assignedTeam}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(inc.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                            inc.status === 'Resolved' || inc.status === 'Closed'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : sla.breached
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          }`}
                        >
                          {inc.status === 'Resolved' || inc.status === 'Closed' ? 'SLA Met' : sla.text}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedIncident(inc)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-colors"
                        >
                          Details &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between p-3.5 border-t border-[#1b233a] bg-[#0a0d18] text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-white">{Math.min(currentPage * pageSize, sorted.length)}</strong> of <strong className="text-white">{sorted.length}</strong> incidents
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg border border-[#1f2842] bg-[#121626] text-slate-300 hover:text-white hover:border-cyan-500/40 disabled:opacity-40 transition-colors"
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

      {/* Incident Details Drawer */}
      <IncidentDetailsDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  );
};
