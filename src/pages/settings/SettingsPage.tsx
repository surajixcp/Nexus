import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, User, Bell, Palette, RotateCcw, CheckCircle2, Shield } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, theme, toggleTheme, resetDemoData, addToast } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalSms, setCriticalSms] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/DEMO/NEXUS/ALERTS');

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Preferences Saved', 'Notification configurations updated.', 'success');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Platform Settings & Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage notification routes, user profile, and display options.
        </p>
      </div>

      <div className="space-y-5">
        {/* Profile Card */}
        <div className="p-5 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <User className="w-4 h-4 text-cyan-400" />
            <span>User Profile & Organization Role</span>
          </div>

          <div className="flex items-center gap-4">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-cyan-500/40" />
            <div>
              <h3 className="text-sm font-bold text-white">{currentUser.name}</h3>
              <p className="text-xs text-cyan-400 font-mono">{currentUser.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#161c2e] text-indigo-300 border border-[#232e4d]">
                  {currentUser.role}
                </span>
                <span className="text-[11px] text-slate-400">{currentUser.department}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <form onSubmit={handleSavePreferences} className="p-5 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>Alert & Paging Channels</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-lg border border-[#1c243b] bg-[#0a0d18] cursor-pointer hover:bg-[#121626] transition-colors">
              <div>
                <span className="font-semibold text-white block">Dispatch Email Broadcasts on P1/P2</span>
                <span className="text-slate-400 text-[11px]">Send simulated emails to support team lists upon ticket logging</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-[#1f2842] bg-[#121626] text-cyan-500 focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-lg border border-[#1c243b] bg-[#0a0d18] cursor-pointer hover:bg-[#121626] transition-colors">
              <div>
                <span className="font-semibold text-white block">Simulate SMS Pager for Critical Severity</span>
                <span className="text-slate-400 text-[11px]">Trigger urgent notification on duty phone for SLA breaches</span>
              </div>
              <input
                type="checkbox"
                checked={criticalSms}
                onChange={(e) => setCriticalSms(e.target.checked)}
                className="h-4 w-4 rounded border-[#1f2842] bg-[#121626] text-cyan-500 focus:ring-cyan-500"
              />
            </label>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Collaboration Webhook Integration (Slack / MS Teams)
              </label>
              <input
                type="text"
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                className="w-full px-3 py-2 font-mono text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-lg shadow-md shadow-cyan-900/30 transition-all"
            >
              Save Notification Preferences
            </button>
          </div>
        </form>

        {/* Theme Settings */}
        <div className="p-5 rounded-xl bg-[#0e1220] border border-[#1c243b] shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span>Appearance & Theme</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-white block">Interface Color Scheme</span>
              <span className="text-slate-400 text-[11px]">Currently active: <strong className="text-cyan-400 capitalize">{theme} Mode</strong> (Obsidian Black Combo)</span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-lg border border-[#1f2842] bg-[#121626] text-slate-300 hover:text-white hover:bg-[#1a233e] font-semibold transition-colors"
            >
              Toggle to {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
