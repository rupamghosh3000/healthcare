import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#ffffff] shadow-[0_-1px_8px_rgba(10,15,29,0.03)] py-16 mt-20 border-t border-[#0A0F1D]/05">
      <div className="max-w-[1360px] mx-auto px-5 md:px-10 flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Logo className="h-7 w-auto object-contain" />
            </div>
            <p className="font-body-default text-body-default text-[#64748B] max-w-md">
              Intelligent, non-emergency healthcare coordination and municipal community aid, powered by real-time triage synthesizers and dedicated volunteer networks.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-[#64748B]">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                System Operational
              </span>
              <span>•</span>
              <span>Municipal Zone Engine v4.2</span>
              <span>•</span>
              <Link to="/admin/login" className="hover:text-[#006a6a] underline">Coordinator Sign In</Link>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-label-caps text-label-caps text-[#161b2a] uppercase font-bold tracking-wider">
              Platform Navigation
            </span>
            <Link className="font-body-sm text-body-sm text-[#64748B] hover:text-[#161b2a] transition-colors" to="/">
              Home Overview
            </Link>
            <Link className="font-body-sm text-body-sm text-[#64748B] hover:text-[#161b2a] transition-colors" to="/request-support">
              Request Care Intake
            </Link>
            <Link className="font-body-sm text-body-sm text-[#64748B] hover:text-[#161b2a] transition-colors" to="/volunteer">
              Volunteer Portal
            </Link>
            <Link className="font-body-sm text-body-sm text-[#64748B] hover:text-[#161b2a] transition-colors" to="/ai-assistant">
              AI Health Intake Summary
            </Link>
            <Link className="font-body-sm text-body-sm text-[#64748B] hover:text-[#161b2a] transition-colors" to="/faq">
              Common Questions
            </Link>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-label-caps text-label-caps text-[#161b2a] uppercase font-bold tracking-wider">
              Information &amp; Trust
            </span>
            <Link className="font-body-sm text-body-sm text-[#64748B] hover:text-[#161b2a] transition-colors" to="/about">
              About CareConnect
            </Link>
            <Link className="font-body-sm text-body-sm text-[#64748B] hover:text-[#161b2a] transition-colors" to="/faq">
              Knowledge Base &amp; FAQ
            </Link>
            <Link className="font-body-sm text-body-sm text-[#64748B] hover:text-[#161b2a] transition-colors" to="/about">
              HIPAA &amp; Privacy Standards
            </Link>
            <Link className="font-body-sm text-body-sm text-[#64748B] hover:text-[#161b2a] transition-colors" to="/volunteer">
              Volunteer Coordination Terms
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-[#64748B] font-body-sm text-body-sm bg-[#f2f3ff]/60 rounded-2xl p-4 border border-[#0A0F1D]/05">
          <p>© 2025 CareConnect Health Services. Engineered for civilian health navigation.</p>
          <p className="text-[#F43F5E] font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">info</span>
            Not for clinical diagnosis or urgent life care.
          </p>
        </div>
      </div>
    </footer>
  );
};
