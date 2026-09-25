import React from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Top Ambient Glow Field */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-[620px] h-[620px] bg-[#00d2d3]/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-[#5bb8fe]/20 rounded-full blur-[130px] pointer-events-none"></div>

        {/* 1. HERO SECTION */}
        <section className="relative max-w-[1360px] mx-auto px-5 md:px-10 pt-28 md:pt-36 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[640px]">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6 z-10">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eaedff]/70 shadow-xs backdrop-blur-md border border-white/60">
                <span className="w-2 h-2 rounded-full bg-[#00d2d3] animate-pulse"></span>
                <span className="font-label-caps text-label-caps text-[#0A0F1D] tracking-wider uppercase font-semibold">
                  COMMUNITY HEALTHCARE SUPPORT • AI ASSISTED
                </span>
              </div>

              {/* Editorial Headline */}
              <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-[#0A0F1D] font-semibold tracking-tight max-w-2xl">
                Healthcare Support, <br className="hidden sm:inline" />
                When You Need It.
              </h1>

              {/* Lead Narrative */}
              <p className="font-body-lead text-body-lead text-[#64748B] max-w-xl">
                Request non-emergency support, connect with community volunteers, and get instant answers to common questions.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/request-support"
                  className="group inline-flex items-center gap-3 px-6 py-4 bg-[#0A0F1D] text-white font-label-lg text-label-lg rounded-full shadow-lg hover:bg-[#006398] transition-all"
                >
                  <span>Request Support</span>
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <span className="material-symbols-outlined text-white text-[18px]">arrow_forward</span>
                  </div>
                </Link>
                <Link
                  to="/volunteer"
                  className="inline-flex items-center justify-center px-6 py-4 bg-white/80 text-[#0A0F1D] font-label-lg text-label-lg rounded-full shadow-md backdrop-blur-xl hover:bg-[#e3e7fc] border border-white/80 transition-all font-semibold"
                >
                  Become a Volunteer
                </Link>
              </div>

              {/* Trust Micro-Proof */}
              <div className="flex items-center gap-4 pt-3 text-[#64748B] font-body-sm text-body-sm">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#006a6a] flex items-center justify-center text-white text-[11px] font-semibold shadow-xs">MC</div>
                  <div className="w-8 h-8 rounded-full bg-[#006398] flex items-center justify-center text-white text-[11px] font-semibold shadow-xs">AR</div>
                  <div className="w-8 h-8 rounded-full bg-[#00687a] flex items-center justify-center text-white text-[11px] font-semibold shadow-xs">DK</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
                  <span>3,840+ verified community volunteers active today</span>
                </div>
              </div>
            </div>

            {/* Right Visual Sculptural Composition */}
            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end min-h-[460px]">
              {/* Central 3D Ribbon Art */}
              <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                <img
                  alt="Fluid cyan and frosted glass ribbon sculpture representing seamless care coordination"
                  className="w-full h-full object-contain filter drop-shadow-[0_24px_48px_rgba(0,106,106,0.18)]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqOOp2EnGcDe2KB3nf9pT87H6a0fy_08ozoQh2nMXsf4aXzveWC3481oxz2fIoq2cwganyYIz79miMiZ1r_QvtsZhEIG-J6ot8TYiVEaGdKpsZ40-S2QvQfs3-xrda2f3OobVfMg_oq-XZf2TkNXHgvhpvyaEWMGy-5JlVII9M4FiyVAFZazmJVZgMD1r1gD-3oLYiCKJop-k8Li-PtPEib9laGXK4dHEprJCJVVvBDEIOrV9uVDi1Bw"
                />

                {/* Rotating Text Badge */}
                <div className="absolute -top-4 -right-4 w-28 h-28 hidden sm:flex items-center justify-center">
                  <div className="absolute inset-0 animate-[spin_18s_linear_infinite] flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <path d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" id="circlePath"></path>
                      <text className="font-label-caps text-[9.5px] fill-[#0A0F1D] tracking-[0.2em] font-semibold uppercase">
                        <textPath href="#circlePath">
                          SUPPORT • COMMUNITY • CARE • AI •
                        </textPath>
                      </text>
                    </svg>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#00d2d3]/30 backdrop-blur-md flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[#006a6a] text-[20px]">health_and_safety</span>
                  </div>
                </div>
              </div>

              {/* Floating Glassmorphism Cards */}
              <div className="absolute -left-4 top-8 sm:left-2 sm:top-12 bg-white/90 backdrop-blur-2xl p-4 rounded-2xl shadow-xl max-w-[210px] hidden sm:block border border-white/80 hover:-translate-y-1 transition-transform">
                <div className="w-7 h-7 rounded-full bg-[#006a6a]/10 flex items-center justify-center mb-2 text-[#006a6a]">
                  <span className="material-symbols-outlined text-[16px]">edit_note</span>
                </div>
                <div className="font-headline-sm text-sm font-semibold text-[#0A0F1D] leading-tight">Support Requests</div>
                <div className="font-body-sm text-[12px] text-[#64748B] mt-1 leading-snug">Tell us what you need and we'll organize your request.</div>
              </div>

              <div className="absolute -bottom-4 left-6 sm:left-4 sm:bottom-6 bg-white/90 backdrop-blur-2xl p-4 rounded-2xl shadow-xl max-w-[220px] border border-white/80 hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#00d2d3]/20 flex items-center justify-center text-[#006a6a]">
                    <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#00d2d3]/20 text-[#005556] font-label-caps text-[9px] uppercase font-semibold">Triage Live</span>
                </div>
                <div className="font-headline-sm text-sm font-semibold text-[#0A0F1D] leading-tight">AI Assisted</div>
                <div className="font-body-sm text-[12px] text-[#64748B] mt-1 leading-snug">Your request is automatically summarized for easier coordination.</div>
              </div>

              <div className="absolute -right-2 bottom-16 sm:right-2 sm:bottom-20 bg-white/90 backdrop-blur-2xl p-4 rounded-2xl shadow-xl max-w-[200px] hidden sm:block border border-white/80 hover:-translate-y-1 transition-transform">
                <div className="w-7 h-7 rounded-full bg-[#006398]/10 flex items-center justify-center mb-2 text-[#006398]">
                  <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                </div>
                <div className="font-headline-sm text-sm font-semibold text-[#0A0F1D] leading-tight">Community Volunteers</div>
                <div className="font-body-sm text-[12px] text-[#64748B] mt-1 leading-snug">Connect support seekers with people willing to help.</div>
              </div>
            </div>

          </div>

          {/* Scroll Down Prompt */}
          <div className="w-full flex justify-center pt-10">
            <a className="flex flex-col items-center gap-1.5 text-[#64748B] hover:text-[#0A0F1D] transition-colors" href="#how-it-works">
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-[10px]">Explore Platform</span>
              <span className="material-symbols-outlined text-[20px] animate-bounce">keyboard_arrow_down</span>
            </a>
          </div>
        </section>
      </div>

      {/* 2. TRUST / METHODOLOGY & ARCHITECTURE */}
      <section className="w-full py-16 bg-[#f2f3ff]/50 border-y border-[#0A0F1D]/05">
        <div className="max-w-[1360px] mx-auto px-5 md:px-10 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label-caps text-label-caps text-[#006a6a] tracking-widest uppercase font-bold">
                Methodology &amp; Architecture
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#0A0F1D] font-semibold tracking-tight mt-1">
                Simple support. Smarter coordination.
              </h2>
            </div>
            <p className="font-body-default text-body-default text-[#64748B] max-w-md">
              A civilian non-emergency intake framework combining humane community networks with synthetic intake clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 01 */}
            <div className="relative bg-white p-8 rounded-3xl shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden border border-gray-100">
              <div className="absolute -right-4 -top-6 font-display-hero text-[#e3e7fc]/40 text-[96px] font-bold select-none pointer-events-none group-hover:text-[#00d2d3]/20 transition-colors">
                01
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                <span className="font-label-caps text-label-caps text-[#64748B] uppercase tracking-wider">Step 01 / Intake</span>
                <div className="w-12 h-12 rounded-2xl bg-[#eaedff] flex items-center justify-center text-[#0A0F1D]">
                  <span className="material-symbols-outlined text-[24px]">assignment</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-[#0A0F1D] font-semibold">REQUEST SUPPORT</h3>
                <p className="font-body-default text-body-default text-[#64748B]">
                  Submit a simple support request with essential non-emergency needs without complicated medical portals or endless queues.
                </p>
              </div>
              <Link
                to="/request-support"
                className="relative z-10 pt-6 flex items-center gap-1.5 text-[#006a6a] font-label-lg text-label-lg font-medium group-hover:gap-2 transition-all"
              >
                <span>Submit a request</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            {/* Card 02 */}
            <div className="relative bg-white p-8 rounded-3xl shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden border border-gray-100">
              <div className="absolute -right-4 -top-6 font-display-hero text-[#e3e7fc]/40 text-[96px] font-bold select-none pointer-events-none group-hover:text-[#00d2d3]/20 transition-colors">
                02
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                <span className="font-label-caps text-label-caps text-[#006a6a] uppercase tracking-wider font-bold">Step 02 / Synthesis</span>
                <div className="w-12 h-12 rounded-2xl bg-[#00d2d3]/20 flex items-center justify-center text-[#005556]">
                  <span className="material-symbols-outlined text-[24px]">psychology</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-[#0A0F1D] font-semibold">AI ORGANIZATION</h3>
                <p className="font-body-default text-body-default text-[#64748B]">
                  AI converts your unstructured request into a clean structured summary, tagging urgency, schedule, and specific assistance requirements.
                </p>
              </div>
              <Link
                to="/ai-assistant"
                className="relative z-10 pt-6 flex items-center gap-1.5 text-[#006a6a] font-label-lg text-label-lg font-medium group-hover:gap-2 transition-all"
              >
                <span>Ask AI Assistant</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            {/* Card 03 */}
            <div className="relative bg-white p-8 rounded-3xl shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden border border-gray-100">
              <div className="absolute -right-4 -top-6 font-display-hero text-[#e3e7fc]/40 text-[96px] font-bold select-none pointer-events-none group-hover:text-[#00d2d3]/20 transition-colors">
                03
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                <span className="font-label-caps text-label-caps text-[#006398] uppercase tracking-wider font-bold">Step 03 / Dispatch</span>
                <div className="w-12 h-12 rounded-2xl bg-[#006398]/10 flex items-center justify-center text-[#006398]">
                  <span className="material-symbols-outlined text-[24px]">group</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-[#0A0F1D] font-semibold">COMMUNITY HELP</h3>
                <p className="font-body-default text-body-default text-[#64748B]">
                  Verified volunteers can register and support people in need with prescription delivery, clinic accompaniment, and daily check-ins.
                </p>
              </div>
              <Link
                to="/volunteer"
                className="relative z-10 pt-6 flex items-center gap-1.5 text-[#006a6a] font-label-lg text-label-lg font-medium group-hover:gap-2 transition-all"
              >
                <span>Volunteer standards</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEQUENTIAL PROTOCOL TIMELINE */}
      <section className="w-full py-20 bg-[#F6F8FA] relative" id="how-it-works">
        <div className="max-w-[1360px] mx-auto px-5 md:px-10 flex flex-col gap-12">
          <div className="flex flex-col items-center text-center gap-2 max-w-xl mx-auto">
            <span className="font-label-caps text-label-caps text-[#006a6a] tracking-widest uppercase font-bold">Sequential Protocol</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#0A0F1D] font-semibold tracking-tight">
              How CareConnect works
            </h2>
            <p className="font-body-default text-body-default text-[#64748B]">
              From voice or text notes to active localized support in four streamlined milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-[#dee2f6] z-0"></div>

            <div className="relative z-10 flex flex-col items-start md:items-center text-left md:text-center gap-3 p-5 bg-white/70 md:bg-transparent rounded-2xl md:rounded-none">
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-[#006a6a] mb-2 border border-gray-100">
                <span className="material-symbols-outlined text-[28px]">chat_bubble_outline</span>
              </div>
              <span className="font-label-caps text-label-caps text-[#006a6a] uppercase font-bold tracking-widest">Phase 01</span>
              <h4 className="font-headline-sm text-body-lead font-semibold text-[#0A0F1D]">Tell us what you need</h4>
              <p className="font-body-sm text-body-sm text-[#64748B]">
                Share requirements via quick form or voice note. Describe mobility, scheduling, or non-medical assistance needs.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-start md:items-center text-left md:text-center gap-3 p-5 bg-white/70 md:bg-transparent rounded-2xl md:rounded-none">
              <div className="w-16 h-16 rounded-full bg-[#00d2d3] text-[#005556] shadow-md flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[28px]">token</span>
              </div>
              <span className="font-label-caps text-label-caps text-[#005556] uppercase font-bold tracking-widest">Phase 02</span>
              <h4 className="font-headline-sm text-body-lead font-semibold text-[#0A0F1D]">AI organizes the request</h4>
              <p className="font-body-sm text-body-sm text-[#64748B]">
                Language models structure your details into standardized key-value descriptors while stripping confidential clinical markers.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-start md:items-center text-left md:text-center gap-3 p-5 bg-white/70 md:bg-transparent rounded-2xl md:rounded-none">
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-[#006398] mb-2 border border-gray-100">
                <span className="material-symbols-outlined text-[28px]">hub</span>
              </div>
              <span className="font-label-caps text-label-caps text-[#006398] uppercase font-bold tracking-widest">Phase 03</span>
              <h4 className="font-headline-sm text-body-lead font-semibold text-[#0A0F1D]">Your request reaches team</h4>
              <p className="font-body-sm text-body-sm text-[#64748B]">
                Local municipal coordinators and community leaders review and route the dispatch to nearby accredited helpers.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-start md:items-center text-left md:text-center gap-3 p-5 bg-white/70 md:bg-transparent rounded-2xl md:rounded-none">
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-[#10B981] mb-2 border border-gray-100">
                <span className="material-symbols-outlined text-[28px]">handshake</span>
              </div>
              <span className="font-label-caps text-label-caps text-[#10B981] uppercase font-bold tracking-widest">Phase 04</span>
              <h4 className="font-headline-sm text-body-lead font-semibold text-[#0A0F1D]">A volunteer provides help</h4>
              <p className="font-body-sm text-body-sm text-[#64748B]">
                A vetted community volunteer accepts the appointment, coordinates directly, and ensures safe, compassionate fulfillment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AI HIGHLIGHT SECTION */}
      <section className="w-full py-20 bg-white relative overflow-hidden border-t border-[#0A0F1D]/05">
        <div className="absolute -right-20 top-1/4 w-[400px] h-[400px] bg-[#00d2d3]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-[1360px] mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 flex flex-col items-start gap-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00d2d3]/20 text-[#005556] font-label-caps text-label-caps uppercase font-bold">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                Real-time Parsing Engine
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#0A0F1D] font-semibold tracking-tight">
                AI that organizes care, not replaces it.
              </h2>
              <p className="font-body-lead text-body-lead text-[#64748B]">
                CareConnect utilizes deterministic parsing modules to convert conversational requests into actionable operational packages without hallucinating medical diagnostics.
              </p>

              <div className="flex flex-col gap-3 w-full pt-1">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#f2f3ff]/70 border border-gray-100">
                  <span className="material-symbols-outlined text-[#006a6a] text-[22px] mt-0.5">lock_person</span>
                  <div>
                    <h5 className="font-headline-sm text-body-default font-semibold text-[#0A0F1D]">Zero Diagnostic Assumption</h5>
                    <p className="font-body-sm text-body-sm text-[#64748B]">The system strictly handles non-clinical logistics: ride sharing, prescription pickup, and bedside companionship.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#f2f3ff]/70 border border-gray-100">
                  <span className="material-symbols-outlined text-[#006398] text-[22px] mt-0.5">verified_user</span>
                  <div>
                    <h5 className="font-headline-sm text-body-default font-semibold text-[#0A0F1D]">Human-in-the-Loop Validation</h5>
                    <p className="font-body-sm text-body-sm text-[#64748B]">All machine summaries are visible to the support seeker before broadcast to neighborhood volunteer networks.</p>
                  </div>
                </div>
              </div>

              <div className="w-full p-4 rounded-2xl bg-[#F43F5E]/10 flex items-center gap-3 border border-[#F43F5E]/20">
                <span className="material-symbols-outlined text-[#F43F5E] text-[22px]">medical_services</span>
                <p className="font-body-sm text-body-sm text-[#161b2a]">
                  <strong className="font-semibold text-[#F43F5E]">Non-Emergency Guarantee:</strong> CareConnect AI cannot prescribe, diagnose, or triage acute traumatic conditions.
                </p>
              </div>
            </div>

            {/* Live AI Synthesized Request Card Preview */}
            <div className="lg:col-span-6 relative">
              <div className="relative bg-[#f2f3ff]/80 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#0A0F1D]/08">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#F43F5E]/80"></span>
                    <span className="w-3 h-3 rounded-full bg-[#F59E0B]/80"></span>
                    <span className="w-3 h-3 rounded-full bg-[#10B981]/80"></span>
                    <span className="ml-3 font-label-caps text-label-caps text-[#64748B] uppercase font-bold tracking-wider">
                      SYNTHESIZED REQUEST CARD
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#006a6a]/10 text-[#006a6a] font-label-caps text-[10px] font-semibold uppercase">
                    STATUS: DISPATCH READY
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline-sm text-headline-sm text-[#0A0F1D] font-semibold">Hospital Companion</h4>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] font-label-caps text-label-caps uppercase font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                      Priority: Normal
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-[#64748B] mt-1">Ref ID: #CC-89410 • Submitted 4 mins ago via Web Assistant</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl shadow-xs border border-gray-100">
                  <div className="flex flex-col">
                    <span className="font-label-caps text-[10px] text-[#64748B] uppercase tracking-wider font-bold">Requirement</span>
                    <span className="font-body-default text-body-default text-[#0A0F1D] font-medium">Person to accompany patient</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-[10px] text-[#64748B] uppercase tracking-wider font-bold">Target Time</span>
                    <span className="font-body-default text-body-default text-[#0A0F1D] font-medium">Tomorrow, 10:00 AM EST</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-[10px] text-[#64748B] uppercase tracking-wider font-bold">Destination</span>
                    <span className="font-body-default text-body-default text-[#0A0F1D] font-medium">Mercy Health Center, West Wing</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-[10px] text-[#64748B] uppercase tracking-wider font-bold">Language Support</span>
                    <span className="font-body-default text-body-default text-[#0A0F1D] font-medium">English &amp; Spanish (Preferred)</span>
                  </div>
                </div>

                <div className="p-3 bg-[#e3e7fc]/50 rounded-xl">
                  <div className="flex items-center justify-between text-[#64748B] font-label-caps text-[10px] uppercase mb-1">
                    <span>Raw User Transcription</span>
                    <span className="material-symbols-outlined text-[14px]">graphic_eq</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-[#64748B] italic">
                    “My mother has an eye checkup tomorrow morning at 10. She needs someone to help her walk to the clinic door and wait with her until discharge...”
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#5bb8fe]/30 text-[#00476e] flex items-center justify-center font-bold text-sm">
                      AR
                    </div>
                    <div>
                      <div className="font-headline-sm text-xs font-semibold text-[#0A0F1D]">Alice Reynolds (RN Retired)</div>
                      <div className="font-body-sm text-[11px] text-[#64748B]">0.8 miles away • 42 missions completed</div>
                    </div>
                  </div>
                  <Link
                    to="/request-support"
                    className="px-4 py-2 bg-[#0A0F1D] text-white font-label-lg text-xs rounded-full shadow-xs hover:bg-[#006398] transition-all"
                  >
                    Try Request Flow
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FINAL CTA SECTION & EMERGENCY NOTICE */}
      <section className="w-full py-20 bg-[#F6F8FA] relative">
        <div className="max-w-[1360px] mx-auto px-5 md:px-10 flex flex-col gap-10">
          
          <div className="relative w-full rounded-3xl bg-[#eaedff]/60 backdrop-blur-2xl p-10 md:p-16 flex flex-col items-center text-center gap-6 overflow-hidden shadow-sm border border-white">
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00d2d3]/20 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/80 text-[#0A0F1D] font-label-caps text-label-caps uppercase tracking-wider font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              Civilian Care Network Online
            </div>

            <h2 className="font-display-hero text-headline-lg-mobile md:text-headline-lg text-[#0A0F1D] font-semibold tracking-tight max-w-2xl">
              Need support? Start here.
            </h2>

            <p className="font-body-lead text-body-lead text-[#64748B] max-w-xl">
              Whether you need a companion for tomorrow's medical visit, groceries during recovery, or wish to offer your time as a neighbor.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 z-10">
              <Link
                to="/request-support"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#0A0F1D] text-white font-label-lg text-label-lg rounded-full shadow-xl hover:bg-[#006398] transition-all"
              >
                <span>Request Support</span>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-white text-[18px]">arrow_forward</span>
                </div>
              </Link>
              <Link
                to="/volunteer"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0A0F1D] font-label-lg text-label-lg rounded-full shadow hover:bg-[#dee2f6] transition-all font-semibold"
              >
                Become a Volunteer
              </Link>
            </div>
          </div>

          {/* Mandatory Emergency Notice Banner */}
          <div className="w-full bg-[#ffdad6]/60 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs border border-[#ffdad6]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">e911_emergency</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-base font-semibold text-[#0A0F1D]">Important Emergency Notice</span>
                <p className="font-body-sm text-body-sm text-[#3b4949] max-w-3xl">
                  If this is a medical emergency, please contact your local emergency service or seek immediate professional medical assistance. CareConnect is strictly not an emergency medical service.
                </p>
              </div>
            </div>
            <a
              className="shrink-0 inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#ba1a1a] text-white font-label-caps text-label-caps rounded-full shadow hover:bg-[#93000a] transition-colors uppercase font-bold tracking-wider"
              href="tel:911"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              Dial 911 Now
            </a>
          </div>

        </div>
      </section>
    </div>
  );
};
