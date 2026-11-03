import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  AlertOctagon,
  PlusCircle,
  TableProperties,
  Flame,
  Mail,
  MessagesSquare,
  Server,
  Sparkles,
  BookOpen,
  FolderLock,
  MessageSquareCode,
  SearchCode,
  FileText,
  BarChart3,
  ShieldCheck,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronRight,
  Layers,
  Activity,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onClose }) => {
  const { incidents, escalations } = useApp();
  const [knowledgeOpen, setKnowledgeOpen] = useState(true);

  const activeIncidentsCount = incidents.filter(
    (i) => i.status === 'Open' || i.status === 'In Progress' || i.status === 'Escalated'
  ).length;

  const activeEscalationsCount = escalations.filter((e) => e.status === 'Active').length;

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  const subNavItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
      isActive
        ? 'bg-indigo-500/20 text-indigo-300 font-semibold border-l-2 border-indigo-400 pl-2.5'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#07090e] text-slate-200 border-r border-[#161c2e] flex flex-col shrink-0 select-none h-screen transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#161c2e] bg-[#090c15]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">NEXUS</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Incident & RAG Platform</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      {/* Nav groups */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {/* Workspace */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace
          </div>
          <nav className="space-y-0.5">
            <NavLink to="/" end className={navItemClass}>
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/incidents" className={navItemClass}>
              <AlertOctagon className="w-4 h-4 text-slate-400" />
              <span className="flex-1">Incident Management</span>
              {activeIncidentsCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500/30 text-red-300 border border-red-500/40">
                  {activeIncidentsCount}
                </span>
              )}
            </NavLink>

            <NavLink to="/create-incident" className={navItemClass}>
              <PlusCircle className="w-4 h-4 text-slate-400" />
              <span>Create Incident</span>
            </NavLink>

            <NavLink to="/tracker" className={navItemClass}>
              <TableProperties className="w-4 h-4 text-slate-400" />
              <span className="flex-1">Incident Tracker</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                24 Col
              </span>
            </NavLink>

            <NavLink to="/escalations" className={navItemClass}>
              <Flame className="w-4 h-4 text-slate-400" />
              <span className="flex-1">Escalation Center</span>
              {activeEscalationsCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/40">
                  {activeEscalationsCount}
                </span>
              )}
            </NavLink>

            <NavLink to="/emails" className={navItemClass}>
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Email Notifications</span>
            </NavLink>

            <NavLink to="/collaboration" className={navItemClass}>
              <MessagesSquare className="w-4 h-4 text-slate-400" />
              <span>Team Collaboration</span>
            </NavLink>
          </nav>
        </div>

        {/* Applications */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Applications
          </div>
          <nav className="space-y-0.5">
            <NavLink to="/applications" className={navItemClass}>
              <Server className="w-4 h-4 text-slate-400" />
              <span>Applications & Services</span>
            </NavLink>
          </nav>
        </div>

        {/* AI & Knowledge Base */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            AI & Knowledge Hub
          </div>
          <nav className="space-y-0.5">
            <NavLink to="/ai-assistant" className={navItemClass}>
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="flex-1">AI Incident Assistant</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300">
                AI
              </span>
            </NavLink>

            {/* Knowledge Base Tree */}
            <div>
              <button
                onClick={() => setKnowledgeOpen(!knowledgeOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>Knowledge Base (RAG)</span>
                </div>
                {knowledgeOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {knowledgeOpen && (
                <div className="pl-6 pt-1 space-y-0.5 border-l border-slate-800/80 ml-4 mt-1">
                  <NavLink to="/knowledge" end className={subNavItemClass}>
                    <span>Knowledge Hub</span>
                  </NavLink>
                  <NavLink to="/knowledge/documents" className={subNavItemClass}>
                    <FolderLock className="w-3.5 h-3.5 opacity-70" />
                    <span>Document Library</span>
                  </NavLink>
                  <NavLink to="/knowledge/chat" className={subNavItemClass}>
                    <MessageSquareCode className="w-3.5 h-3.5 opacity-70" />
                    <span>AI Knowledge Chat</span>
                  </NavLink>
                  <NavLink to="/knowledge/search" className={subNavItemClass}>
                    <SearchCode className="w-3.5 h-3.5 opacity-70" />
                    <span>Semantic Search</span>
                  </NavLink>
                  <NavLink to="/knowledge/articles" className={subNavItemClass}>
                    <FileText className="w-3.5 h-3.5 opacity-70" />
                    <span>Knowledge Articles</span>
                  </NavLink>
                  <NavLink to="/knowledge/analytics" className={subNavItemClass}>
                    <BarChart3 className="w-3.5 h-3.5 opacity-70" />
                    <span>Knowledge Analytics</span>
                  </NavLink>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Administration */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Administration
          </div>
          <nav className="space-y-0.5">
            <NavLink to="/admin" className={navItemClass}>
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Administration</span>
            </NavLink>
            <NavLink to="/settings" className={navItemClass}>
              <SettingsIcon className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* System Status footer */}
      <div className="p-3 bg-[#090c15] border-t border-[#161c2e]">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 py-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse shadow-sm shadow-emerald-500/50" />
            <span className="font-medium text-slate-300">Nexus Mesh Online</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500">v4.2.0-ent</span>
        </div>
      </div>
    </aside>
    </>
  );
};

