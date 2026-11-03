import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Plus,
  Sun,
  Moon,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Shield,
  Layers,
  HelpCircle,
  ExternalLink,
  CheckCircle,
  Menu,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { SeverityBadge, StatusBadge } from '../ui/Badge';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const {
    currentUser,
    currentRole,
    switchRole,
    theme,
    toggleTheme,
    incidents,
    trackerRecords,
    documents,
    resetDemoData,
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  // Search modal state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Compute breadcrumbs
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return ['Workspace', 'Dashboard'];
    if (path === '/incidents') return ['Workspace', 'Incident Management'];
    if (path === '/create-incident') return ['Workspace', 'Create Incident'];
    if (path === '/tracker') return ['Workspace', 'Incident Tracker'];
    if (path === '/escalations') return ['Workspace', 'Escalation Center'];
    if (path === '/emails') return ['Workspace', 'Email Notifications'];
    if (path === '/collaboration') return ['Workspace', 'Team Collaboration'];
    if (path === '/applications') return ['Applications', 'Applications & Services'];
    if (path === '/ai-assistant') return ['AI & Knowledge', 'AI Incident Assistant'];
    if (path === '/knowledge') return ['AI & Knowledge', 'Knowledge Dashboard'];
    if (path === '/knowledge/documents') return ['AI & Knowledge', 'Document Library'];
    if (path === '/knowledge/chat') return ['AI & Knowledge', 'AI Knowledge Chat (RAG)'];
    if (path === '/knowledge/search') return ['AI & Knowledge', 'Semantic Search'];
    if (path === '/knowledge/articles') return ['AI & Knowledge', 'Knowledge Articles'];
    if (path === '/knowledge/analytics') return ['AI & Knowledge', 'Knowledge Analytics'];
    if (path === '/admin') return ['Administration', 'Access & Team Controls'];
    if (path === '/settings') return ['Settings', 'Preferences'];
    return ['Portal', 'Overview'];
  };

  const breadcrumbs = getBreadcrumbs();

  // Filtered search results
  const filteredIncidents = searchQuery.trim()
    ? incidents.filter(
        (i) =>
          i.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.application.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const filteredTracker = searchQuery.trim()
    ? trackerRecords.filter(
        (t) =>
          t.problemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.alertDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.application.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const filteredDocs = searchQuery.trim()
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  return (
    <header className="sticky top-0 z-30 flex flex-col bg-[#0a0d17] border-b border-[#161c2e] transition-colors shadow-sm">
      {/* Persistent Demo Environment Banner */}
      <div className="bg-gradient-to-r from-[#070b16] via-[#0c1427] to-[#070b16] text-cyan-300 border-b border-[#162038] text-[11px] font-semibold tracking-wider uppercase py-1 px-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="text-white font-bold">DEMO ENVIRONMENT · SYNTHETIC DATA ONLY</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300 text-[11px] font-normal normal-case">
          <span className="hidden sm:inline text-slate-400">Presentation Mode Active</span>
          <button
            onClick={() => setResetModalOpen(true)}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="flex items-center justify-between h-14 px-4 sm:px-6 bg-[#0a0d17]">
        {/* Left: Hamburger & Breadcrumbs */}
        <div className="flex items-center gap-2.5 text-xs">
          <button
            onClick={onToggleMobileMenu}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="hidden sm:inline text-slate-400 font-medium">{breadcrumbs[0]}</span>
          <span className="hidden sm:inline text-slate-600">/</span>
          <span className="font-semibold text-slate-100">{breadcrumbs[1]}</span>
        </div>

        {/* Center: Global Search trigger */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search incidents and knowledge"
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-[#101423] border border-[#1d253d] rounded-lg hover:border-cyan-500/50 hover:text-slate-200 transition-all shadow-inner"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search incidents, tracker IDs, knowledge...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#161c2e] border border-[#242d47] rounded text-slate-400">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Incident Button */}
          <Link
            to="/create-incident"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-lg shadow-md shadow-indigo-950/40 transition-all hover:shadow-indigo-900/50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Incident</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#131726] transition-colors border border-transparent hover:border-[#1e263d]"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Notification Center Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="View notifications"
              className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#131726] transition-colors border border-transparent hover:border-[#1e263d]"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0a0d17]" />
            </button>

            {/* Notification Dropdown Drawer */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0e1220] border border-[#1e263e] rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-[#1c2338]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Operational Alerts (3 Active)
                  </h4>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="divide-y divide-[#181f33] mt-2 max-h-72 overflow-y-auto">
                  <div className="py-2.5 flex items-start gap-2.5">
                    <span className="w-2 h-2 mt-1 rounded-full bg-rose-500 shrink-0 animate-ping" />
                    <div>
                      <p className="text-xs font-semibold text-white">
                        P1 Critical: PayWave Gateway Latency
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Switch response time &gt; 8500ms. SLA countdown active.
                      </p>
                      <span className="text-[10px] text-slate-500">12m ago</span>
                    </div>
                  </div>
                  <div className="py-2.5 flex items-start gap-2.5">
                    <span className="w-2 h-2 mt-1 rounded-full bg-amber-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-white">
                        PostgreSQL Database Connection Pool 98%
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Escalated to L3 Principal DBA (James Wilson).
                      </p>
                      <span className="text-[10px] text-slate-500">45m ago</span>
                    </div>
                  </div>
                  <div className="py-2.5 flex items-start gap-2.5">
                    <span className="w-2 h-2 mt-1 rounded-full bg-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-white">
                        DEMO-INC-0007 Resolved
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        UPI Switch MPLS failover completed. Traffic 100% normalized.
                      </p>
                      <span className="text-[10px] text-slate-500">3h ago</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#1c2338] mt-2 text-center">
                  <Link
                    to="/incidents"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs font-medium text-cyan-400 hover:underline"
                  >
                    View all incident alerts &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg border border-[#1e263e] bg-[#101423] hover:bg-[#151b2e] transition-all text-left"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-cyan-500/40"
              />
              <div className="hidden xl:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-cyan-400 font-medium">
                  {currentRole}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role Dropdown */}
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0e1220] border border-[#1e263e] rounded-xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-[#1c2338] mb-1">
                  <p className="text-xs font-bold text-white">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                  <p className="text-[10px] text-cyan-400 font-medium mt-0.5">
                    {currentUser.department}
                  </p>
                </div>

                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Demo Role
                </div>

                {(['Admin', 'Employee', 'Support Engineer', 'Manager'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      currentRole === r
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                        : 'text-slate-300 hover:bg-[#161c2e] hover:text-white'
                    }`}
                  >
                    <span>{r}</span>
                    {currentRole === r && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}

                <div className="pt-2 mt-1 border-t border-[#1c2338]">
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      setResetModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Demo Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <Modal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Global Enterprise Search"
        description="Search across incidents, tracker records, and knowledge base documents"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID (e.g. DEMO-INC-0001), application, error message, or runbook..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>

          {searchQuery.trim() === '' ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-60" />
              <p>Type keywords to search across 32 incidents, operational trackers, and SOP documents.</p>
              <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                {['DEMO-INC-0001', 'PayWave', 'PostgreSQL', 'Keycloak', 'BGP', 'Kafka'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Incidents */}
              {filteredIncidents.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Incidents ({filteredIncidents.length})
                  </h5>
                  <div className="space-y-1.5">
                    {filteredIncidents.map((inc) => (
                      <div
                        key={inc.id}
                        onClick={() => {
                          setSearchOpen(false);
                          navigate(`/incidents?id=${inc.id}`);
                        }}
                        className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                              {inc.ticketId}
                            </span>
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {inc.title}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">{inc.application}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <SeverityBadge severity={inc.severity} size="sm" />
                          <StatusBadge status={inc.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tracker */}
              {filteredTracker.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Tracker Records ({filteredTracker.length})
                  </h5>
                  <div className="space-y-1.5">
                    {filteredTracker.map((tr) => (
                      <div
                        key={tr.srNo}
                        onClick={() => {
                          setSearchOpen(false);
                          navigate('/tracker');
                        }}
                        className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                              {tr.problemId}
                            </span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                              {tr.alertDescription}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">{tr.application}</span>
                        </div>
                        <SeverityBadge severity={tr.severity} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {filteredDocs.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Knowledge Base Documents ({filteredDocs.length})
                  </h5>
                  <div className="space-y-1.5">
                    {filteredDocs.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setSearchOpen(false);
                          navigate('/knowledge/documents');
                        }}
                        className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-slate-400">{doc.category} · {doc.fileType}</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset All Demo Data"
        description="Restore all incidents, tracker records, and enterprise knowledge to the initial synthetic dataset."
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            This will clear your local modifications and reload the 32 synthetic incidents, 32 spreadsheet tracker rows, 15 enterprise documents, and 10 runbooks.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              onClick={() => setResetModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                resetDemoData();
                setResetModalOpen(false);
              }}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
            >
              Yes, Reset Everything
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
};
