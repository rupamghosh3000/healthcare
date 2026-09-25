import React from 'react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="relative w-full overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-20 left-1/4 w-[550px] h-[550px] bg-[#00d2d3]/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-[1100px] mx-auto px-5 md:px-10 pt-28 md:pt-36 pb-20">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eaedff] text-[#006a6a] font-label-caps text-xs uppercase font-bold tracking-wider">
              <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
              Mission &amp; Civic Architecture
            </div>
            <h1 className="font-display-hero text-headline-lg md:text-display-hero text-[#0A0F1D] tracking-tight">
              Organizing Care, Empowering Neighbors.
            </h1>
            <p className="font-body-lead text-base md:text-lg text-[#64748B]">
              CareConnect bridges the gap between everyday non-clinical healthcare needs and vetted neighborhood volunteers through responsible AI synthesis and municipal human coordination.
            </p>
          </div>

          {/* Triad Architecture Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xs flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#eaedff] text-[#006a6a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">diversity_1</span>
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-[#0A0F1D]">Community Support</h3>
              <p className="font-body-default text-sm text-[#64748B] leading-relaxed">
                Ordinary neighbors offering extraordinary comfort: driving someone home from cataract recovery, walking alongside seniors into bustling clinics, or delivering maintenance prescriptions.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xs flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00d2d3]/20 text-[#006a6a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">psychology</span>
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-[#0A0F1D]">AI Organization</h3>
              <p className="font-body-default text-sm text-[#64748B] leading-relaxed">
                Deterministic language models parse conversational requests into standardized logistics packages—extracting sector zones, mobility requirements, and scheduled slots while guarding clinical privacy.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xs flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#cce5ff] text-[#006398] flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">verified_user</span>
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-[#0A0F1D]">Human Coordination</h3>
              <p className="font-body-default text-sm text-[#64748B] leading-relaxed">
                Accredited district desk coordinators verify matches, conduct identity trust checks on all volunteers, and oversee timely handoffs.
              </p>
            </div>
          </div>

          {/* End-to-End Visual Workflow Diagram */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-sm border border-white mb-16">
            <div className="flex flex-col items-center text-center gap-2 mb-10">
              <span className="font-label-caps text-label-caps text-[#006a6a] uppercase font-bold tracking-wider">
                End-to-End Routing Flow
              </span>
              <h2 className="font-headline-lg text-2xl md:text-3xl font-semibold text-[#0A0F1D]">
                How information safely travels
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center p-4 bg-[#f2f3ff]/60 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#006a6a]/10 text-[#006a6a] flex items-center justify-center mb-2 font-bold">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <span className="font-headline-sm text-sm font-bold text-[#0A0F1D]">Support Seeker</span>
                <span className="font-body-sm text-xs text-[#64748B] mt-1">Submits natural requirement</span>
              </div>

              <div className="hidden sm:flex justify-center text-[#00d2d3]">
                <span className="material-symbols-outlined text-2xl">arrow_forward</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center p-4 bg-[#f2f3ff]/60 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#00d2d3]/20 text-[#006a6a] flex items-center justify-center mb-2 font-bold">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <span className="font-headline-sm text-sm font-bold text-[#0A0F1D]">AI Synthesis</span>
                <span className="font-body-sm text-xs text-[#64748B] mt-1">Normalizes metrics &amp; zone</span>
              </div>

              <div className="hidden sm:flex justify-center text-[#00d2d3]">
                <span className="material-symbols-outlined text-2xl">arrow_forward</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center p-4 bg-[#f2f3ff]/60 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#006398]/10 text-[#006398] flex items-center justify-center mb-2 font-bold">
                  <span className="material-symbols-outlined">volunteer_activism</span>
                </div>
                <span className="font-headline-sm text-sm font-bold text-[#0A0F1D]">Civic Volunteer</span>
                <span className="font-body-sm text-xs text-[#64748B] mt-1">Accepts and assists</span>
              </div>
            </div>
          </div>

          {/* Privacy & Governance Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" id="hipaa">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#006a6a]">
                <span className="material-symbols-outlined text-[24px]">shield</span>
                <h3 className="font-headline-sm text-lg font-bold text-[#0A0F1D]">HIPAA &amp; Privacy Standards</h3>
              </div>
              <p className="font-body-default text-sm text-[#64748B] leading-relaxed">
                CareConnect is strictly engineered for non-clinical logistics. We strip unneeded personal health identifier fields and only retain destination ward and mobility aid requirements for matching. Data in transit is secured with AES-256 encryption.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#F43F5E]">
                <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
                <h3 className="font-headline-sm text-lg font-bold text-[#0A0F1D]">Strict Emergency Boundary</h3>
              </div>
              <p className="font-body-default text-sm text-[#64748B] leading-relaxed">
                CareConnect is NOT a 911 dispatch alternative. We do not provide paramedic transport, oxygen supplies, or medical diagnosis. If a life-threatening crisis arises, callers are directed straight to professional municipal emergency services.
              </p>
            </div>
          </div>

          {/* Bottom Action CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/request-support"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#0A0F1D] text-white font-label-lg text-sm rounded-full shadow hover:bg-[#006398] transition-all font-semibold"
            >
              Request Support
            </Link>
            <Link
              to="/volunteer"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#0A0F1D] font-label-lg text-sm rounded-full shadow border border-gray-200 hover:bg-[#dee2f6] transition-all font-semibold"
            >
              Become a Volunteer
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
