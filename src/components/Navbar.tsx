import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { LiveVoiceModal } from './LiveVoiceModal';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout, signInWithGoogle } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Request Support', path: '/request-support' },
    { name: 'Volunteer', path: '/volunteer' },
    { name: 'FAQ', path: '/faq' },
    { name: 'AI Assistant', path: '/ai-assistant' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setUserDropdownOpen(false);
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
    }
  };

  return (
    <>
      <header className="fixed top-6 left-0 right-0 z-40 px-5 md:px-10 pointer-events-none">
        <div className="max-w-[1360px] mx-auto">
          <div className="h-20 pointer-events-auto bg-[rgba(255,255,255,0.88)] backdrop-blur-2xl rounded-full border border-white/60 shadow-[0_12px_32px_-4px_rgba(10,15,29,0.08),0_2px_6px_0_rgba(10,15,29,0.02)] px-4 md:px-6 flex items-center justify-between gap-4">
            
            {/* Logo & Brand */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <Logo className="h-8 w-auto object-contain transition-transform group-hover:scale-105" />
            </Link>

            {/* Desktop Navigation Pill */}
            <nav className="hidden lg:flex items-center gap-1 p-1 bg-[#eaedff]/60 rounded-full border border-white/40">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-1.5 rounded-full font-label-lg text-label-lg transition-all ${
                      active
                        ? 'bg-[#0A0F1D] text-white shadow-sm font-semibold'
                        : 'text-[#3b4949] hover:bg-[#dee2f6]/70 hover:text-[#161b2a]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {isAuthenticated && (
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-1.5 rounded-full font-label-lg text-label-lg transition-all flex items-center gap-1 ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-[#006a6a] text-white font-semibold'
                      : 'text-[#006a6a] hover:bg-[#dee2f6]/70'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">shield</span>
                  <span>Dashboard</span>
                </Link>
              )}
            </nav>

            {/* Right Action Stack */}
            <div className="flex items-center gap-2.5 shrink-0">
              
              {/* Feature 2: Voice Live launcher button */}
              <button
                type="button"
                onClick={() => setVoiceModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#006a6a]/10 hover:bg-[#006a6a]/20 text-[#006a6a] text-xs font-semibold border border-[#00d2d3]/30 transition-all shadow-xs"
                title="Start Voice Conversation with Gemini 3.8 Live"
              >
                <span className="material-symbols-outlined text-[16px] text-[#00d2d3] animate-pulse">mic</span>
                <span>Voice Live</span>
              </button>

              <Link
                to="/request-support"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-[#00d2d3] text-[#005556] font-label-lg text-label-lg rounded-full shadow-[0_0_24px_-4px_rgba(0,210,211,0.35)] hover:bg-[#56f9f9] hover:text-[#002020] transition-all font-semibold"
              >
                Get Support
              </Link>

              {/* Profile Avatar / Google Auth Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-10 h-10 rounded-full overflow-hidden bg-[#006a6a] text-white flex items-center justify-center hover:opacity-90 transition-all shadow-sm focus:outline-none ring-2 ring-white"
                  title={isAuthenticated ? `Logged in as ${user?.name}` : 'Sign In'}
                  aria-label="User Account"
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                  ) : isAuthenticated ? (
                    <span className="font-semibold text-xs">{user?.name?.slice(0, 2).toUpperCase() || 'US'}</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  )}
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-[#0A0F1D]/08 py-3 z-50 text-sm animate-in fade-in zoom-in-95 duration-150"
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-5 py-2.5 border-b border-gray-100 flex items-center gap-3">
                          {user?.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#006a6a] text-white flex items-center justify-center font-bold text-xs">
                              {user?.name?.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <div className="font-semibold text-[#0A0F1D] truncate">{user?.name}</div>
                            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] bg-[#00d2d3]/20 text-[#006a6a] font-bold">
                              {user?.authProvider === 'google' ? 'Google Auth' : 'Coordinator'}
                            </span>
                          </div>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-5 py-2 text-gray-700 hover:bg-[#F6F8FA]"
                          >
                            <span className="material-symbols-outlined text-[18px] text-[#006a6a]">dashboard</span>
                            Admin Dashboard
                          </Link>
                          
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              setVoiceModalOpen(true);
                            }}
                            className="w-full text-left flex items-center gap-2.5 px-5 py-2 text-gray-700 hover:bg-[#F6F8FA]"
                          >
                            <span className="material-symbols-outlined text-[18px] text-[#00d2d3]">mic</span>
                            Voice Conversation
                          </button>
                        </div>

                        <div className="pt-1 border-t border-gray-100">
                          <button
                            onClick={() => {
                              logout();
                              setUserDropdownOpen(false);
                            }}
                            className="w-full text-left flex items-center gap-2.5 px-5 py-2 text-[#ba1a1a] hover:bg-red-50 font-medium"
                          >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-3 flex flex-col gap-2">
                        <div className="px-2 text-xs text-gray-500 font-medium">
                          Secure Sign-In
                        </div>
                        
                        {/* Feature 1: Google Sign-in with Firebase Auth */}
                        <button
                          onClick={handleGoogleSignIn}
                          className="w-full h-11 px-4 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 text-[#0A0F1D] text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                          </svg>
                          <span>Sign in with Google</span>
                        </button>

                        <div className="relative my-1 text-center">
                          <span className="bg-white px-2 text-[10px] text-gray-400">or coordinator</span>
                        </div>

                        <Link
                          to="/admin/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full h-10 px-4 rounded-2xl bg-[#f2f3ff] hover:bg-[#dee2f6] text-[#0A0F1D] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px] text-[#006a6a]">admin_panel_settings</span>
                          Coordinator Login
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 text-[#0A0F1D]"
                aria-label="Toggle navigation menu"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="pointer-events-auto lg:hidden mt-3 bg-white/95 backdrop-blur-2xl rounded-3xl p-5 shadow-2xl border border-white/60 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setVoiceModalOpen(true);
                }}
                className="px-4 py-3 rounded-2xl font-label-lg text-label-lg text-[#006a6a] bg-[#00d2d3]/15 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a6a]">mic</span>
                  <span>Voice Live Conversation</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#006a6a] text-white font-bold">
                  gemini-3.8-live
                </span>
              </button>

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-2xl font-label-lg text-label-lg transition-all ${
                    isActive(link.path)
                      ? 'bg-[#0A0F1D] text-white font-semibold'
                      : 'text-[#161b2a] hover:bg-[#eaedff]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    handleGoogleSignIn();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 rounded-2xl font-label-lg text-label-lg bg-gray-100 flex items-center justify-center gap-2 text-xs font-semibold"
                >
                  <span>Sign in with Google</span>
                </button>
              ) : (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-2xl font-label-lg text-label-lg text-[#006a6a] bg-[#00d2d3]/15 flex items-center justify-between"
                >
                  <span>Admin Dashboard</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Feature 2: Gemini 3.8 Live Voice Modal */}
      <LiveVoiceModal isOpen={voiceModalOpen} onClose={() => setVoiceModalOpen(false)} />
    </>
  );
};
