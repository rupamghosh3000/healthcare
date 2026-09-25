import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@careconnect.org');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  const fillDemoCreds = () => {
    setEmail('admin@careconnect.org');
    setPassword('admin123');
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center pt-28 pb-20 px-5">
      <div className="relative w-full max-w-[460px]">
        {/* Glow behind modal */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#00d2d3]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#5bb8fe]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white flex flex-col gap-6">
          
          <div className="flex flex-col items-center text-center gap-2">
            <Logo className="h-9 w-auto object-contain mb-1" />
            <h1 className="font-headline-lg text-2xl font-bold text-[#0A0F1D] tracking-tight">
              Coordinator Portal
            </h1>
            <p className="font-body-sm text-sm text-[#64748B]">
              Sign in to manage support intake dispatches, volunteer verification, and triage telemetry.
            </p>
          </div>

          {/* Demo helper pill */}
          <div className="bg-[#f2f3ff] rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs border border-gray-200">
            <div>
              <div className="font-semibold text-[#0A0F1D]">Demo Credentials</div>
              <div className="text-gray-500 text-[11px]">admin@careconnect.org / admin123</div>
            </div>
            <button
              type="button"
              onClick={fillDemoCreds}
              className="px-3 py-1 bg-white text-[#006a6a] font-semibold rounded-full shadow-xs border border-gray-200 hover:bg-[#006a6a] hover:text-white transition-all shrink-0"
            >
              Fill Credentials
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-lg text-xs font-semibold text-[#0A0F1D]" htmlFor="email">
                Coordinator Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@careconnect.org"
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#F6F8FA] border border-gray-200 text-sm text-[#0A0F1D] focus:outline-none focus:ring-2 focus:ring-[#00d2d3]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-lg text-xs font-semibold text-[#0A0F1D]" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  lock
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#F6F8FA] border border-gray-200 text-sm text-[#0A0F1D] focus:outline-none focus:ring-2 focus:ring-[#00d2d3]"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-[#ffdad6] text-[#93000a] rounded-xl text-xs font-medium border border-[#ba1a1a]/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full h-12 rounded-full bg-[#0A0F1D] text-white font-label-lg text-sm font-semibold hover:bg-[#006398] transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Coordinator</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
