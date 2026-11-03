import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { DEMO_USERS } from '../../data/mockUsers';
import {
  Activity,
  Lock,
  Mail,
  Shield,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export const LoginPage: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const { switchRole, currentRole, addToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('alex.morgan@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<UserRole>('Admin');
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSelectRole = (r: UserRole) => {
    setRole(r);
    setEmail(DEMO_USERS[r].email);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      switchRole(role);
      onLoginSuccess();
      navigate('/');
    }, 600);
  };

  const handleMicrosoftSSO = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      switchRole('Admin');
      addToast('SSO Verified', 'Authenticated via Azure AD / Microsoft Entra ID', 'success');
      onLoginSuccess();
      navigate('/');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Decorative gradient glow background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#0e1220] border border-[#1c243b] rounded-3xl shadow-2xl p-8 space-y-6 z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 items-center justify-center text-white shadow-xl shadow-cyan-600/20">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            NEXUS PLATFORM
          </h1>
          <p className="text-xs text-slate-400">
            AI-Powered Enterprise Incident & Escalation Portal
          </p>
        </div>

        {/* Demo Roles Quick Selector */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            Select Demo Persona:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {(['Admin', 'Employee', 'Support Engineer', 'Manager'] as UserRole[]).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => handleSelectRole(r)}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all text-left flex items-center gap-2 ${
                  role === r
                    ? 'border-cyan-500 bg-cyan-950/30 text-white ring-1 ring-cyan-500/40 shadow-sm shadow-cyan-950'
                    : 'border-[#1f2842] bg-[#121626] text-slate-300 hover:bg-[#181d33]'
                }`}
              >
                <img src={DEMO_USERS[r].avatar} alt={r} className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-slate-700" />
                <span className="truncate">{r}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Organization Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-900/40 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying Credentials...
              </span>
            ) : (
              <>
                <span>Sign In as {role}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#1c243b] w-full" />
          <span className="bg-[#0e1220] px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
            Or Enterprise SSO
          </span>
        </div>

        {/* Microsoft SSO simulation */}
        <button
          onClick={handleMicrosoftSSO}
          type="button"
          className="w-full py-2.5 px-4 bg-[#161c2e] hover:bg-[#1c243b] text-slate-200 text-xs font-semibold rounded-xl border border-[#232e4d] transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 23 23">
            <path fill="#f35325" d="M1 1h10v10H1z"/>
            <path fill="#81bc06" d="M12 1h10v10H12z"/>
            <path fill="#05a6f0" d="M1 12h10v10H1z"/>
            <path fill="#ffba08" d="M12 12h10v10H12z"/>
          </svg>
          <span>Sign in with Microsoft 365 (SSO)</span>
        </button>

        {/* Demo Credentials footer */}
        <div className="pt-2 text-center text-[11px] text-slate-500">
          <p>Presentation Demo Mode · Fictional Identity Directory</p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Password Request"
        description="Simulated password reset email dispatch."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Enter your enterprise email address. A demo password reset link will be simulated.
          </p>
          <input
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="your.name@example.com"
            className="w-full px-3 py-2 text-xs bg-[#121626] border border-[#1f2842] rounded-lg text-white focus:outline-hidden focus:border-cyan-500"
          />
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1c243b]">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setForgotModalOpen(false);
                addToast('Reset Dispatched', 'Password reset instructions sent (simulated).', 'success');
              }}
              className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-lg shadow-md shadow-cyan-900/30"
            >
              Send Reset Link
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
