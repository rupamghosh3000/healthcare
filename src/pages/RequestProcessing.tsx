import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { SupportRequest } from '../types';

export const RequestProcessing: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [request, setRequest] = useState<SupportRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [pipelineStep, setPipelineStep] = useState(3);
  const [progressPercent, setProgressPercent] = useState(75);
  const [isContinuing, setIsContinuing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchRequest = async () => {
      if (!id) return;
      try {
        const data = await api.getRequestById(id);
        if (isMounted) {
          setRequest(data.request);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load request:', err);
        // Fallback default for demo if id is generic
        if (isMounted) {
          setRequest({
            id: id || 'CC-1042',
            name: 'Eleanor Vance',
            email: 'eleanor.vance@example.org',
            phone: '(555) 234-8901',
            category: 'Hospital Companion',
            preferredDate: 'Tomorrow',
            preferredTime: '10:00 AM',
            location: 'City Hospital, West Wing',
            description: 'Someone to accompany the patient through ambulatory check-in, waiting room transitions, and pharmacy collection.',
            urgency: 'normal',
            status: 'Reviewing',
            aiSummary: {
              category: 'Hospital Companion',
              requirement: 'Someone to accompany the patient through ambulatory check-in, waiting room transitions, and pharmacy collection.',
              date: 'Tomorrow',
              time: '10:00 AM',
              location: 'City Hospital, West Wing',
              priority: 'Normal',
              zoneMatch: 'West Health District #04',
              notes: 'Wheelchair assistance ready • English speaker • Check-in: 15m prior'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          setLoading(false);
        }
      }
    };

    fetchRequest();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleContinue = () => {
    setIsContinuing(true);
    setPipelineStep(4);
    setProgressPercent(100);

    setTimeout(() => {
      navigate(`/request-success/${request?.id || id || 'CC-1042'}`);
    }, 1200);
  };

  const summary = request?.aiSummary;

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="relative w-full overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-32 right-1/4 w-[520px] h-[520px] rounded-full bg-[#00d2d3]/15 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 -left-20 w-[440px] h-[440px] rounded-full bg-[#5bb8fe]/15 blur-[100px] pointer-events-none"></div>

        <div className="max-w-[1360px] mx-auto px-5 md:px-10 pt-28 md:pt-36 pb-20">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Progress & Sector Telemetry */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaedff]/70 w-fit border border-white">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#00d2d3] animate-pulse"></span>
                  <span className="font-label-caps text-label-caps text-[#3b4949] uppercase tracking-wider font-semibold">
                    Intake Dispatch Engine • v4.2
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-[#0A0F1D] tracking-tight mt-1">
                  Organizing your request
                </h1>
                <p className="font-body-default text-body-default text-[#64748B]">
                  Our neural intake model digests patient specifications, cross-references volunteer availability in your sector, and formats critical metrics for municipal desk dispatch.
                </p>
              </div>

              {/* Synthesis Pipeline Card */}
              <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 shadow-sm border border-white/80 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-1">
                  <span className="font-label-caps text-label-caps text-[#64748B] uppercase font-bold tracking-wider">
                    Synthesis Pipeline
                  </span>
                  <span className="font-label-caps text-label-caps text-[#006a6a] font-bold" id="progress-percentage">
                    {progressPercent}% Complete
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-sm text-[#0A0F1D] font-semibold">Request received</span>
                      <span className="font-body-sm text-xs text-[#64748B]">
                        Timestamped {new Date(request?.createdAt || Date.now()).toLocaleTimeString()} via Secure Web Gateway
                      </span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-sm text-[#0A0F1D] font-semibold">Information validated</span>
                      <span className="font-body-sm text-xs text-[#64748B]">
                        Municipal zone match: {summary?.zoneMatch || 'West Health District #04'}
                      </span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3">
                    <div className="relative w-7 h-7 rounded-full bg-[#00d2d3]/20 text-[#006a6a] flex items-center justify-center shrink-0">
                      {pipelineStep === 3 ? (
                        <>
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#006a6a] animate-ping absolute"></span>
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#006a6a] relative"></span>
                        </>
                      ) : (
                        <span className="material-symbols-outlined text-[18px] text-[#10B981]">check</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-label-lg text-sm text-[#0A0F1D] font-semibold">Generating AI summary</span>
                        {pipelineStep === 3 && (
                          <span className="font-label-caps text-label-caps text-[#006a6a] uppercase animate-pulse font-bold">
                            Synthesized
                          </span>
                        )}
                      </div>
                      <span className="font-body-sm text-xs text-[#64748B]">
                        Parsing companion logistics &amp; ward accessibility
                      </span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className={`flex items-start gap-3 transition-opacity ${pipelineStep === 4 ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="w-7 h-7 rounded-full bg-[#eaedff] text-[#3b4949] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px]">
                        {pipelineStep === 4 ? 'check' : 'schedule'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-sm text-[#3b4949] font-semibold">Preparing confirmation</span>
                      <span className="font-body-sm text-xs text-[#64748B]">Queueing coordinator handshake</span>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-[#eaedff] rounded-full h-1.5 overflow-hidden mt-1">
                  <div
                    className="bg-[#00d2d3] h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Triage Governance */}
              <div className="relative rounded-3xl p-5 bg-[#cce5ff]/30 backdrop-blur-md flex items-start gap-3 overflow-hidden border border-[#cce5ff]">
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#00d2d3]/20 rounded-full blur-xl pointer-events-none"></div>
                <span className="material-symbols-outlined text-[#006398] text-[22px] shrink-0 mt-0.5">verified_user</span>
                <div className="flex flex-col gap-1">
                  <span className="font-label-caps text-label-caps text-[#006398] uppercase font-bold tracking-wider">
                    Triage Governance
                  </span>
                  <p className="font-body-sm text-xs text-[#004b73] leading-relaxed">
                    Requests are processed via HIPAA-aligned privacy enclave. Your identity is anonymized until a validated local caregiver commits to your slot.
                  </p>
                </div>
              </div>

              {/* West Wing Nav Station Preview Card */}
              <div className="relative rounded-3xl overflow-hidden h-36 bg-[#eaedff] shadow-xs group border border-white">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB6S1hoMeDPHIyOcZ6s0klocIohkcOpNo4IvQQ8xTnQLTr2QdEha9ZQlXwQfIO7733iUrxX6MxLMSD6jT_f2BDFaviZXjfI8ph3saKz2iOGM84Ag498-0XoT4srVOlQSrRSgPFwA2c0HJd5L1zmsgx00a3OzTfSygPVBMAWgYZxNims9TIyNHm7YR8IyRSsZ705Mc4IKG77ZP5Inaf8kjQ8K1ZD9Mx8g1MuZNxQRqn_FaEDiEKIARpaGw')`
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D]/80 via-[#0A0F1D]/30 to-transparent flex items-end p-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-white">
                      <span className="material-symbols-outlined text-[18px] text-[#00d2d3]">location_on</span>
                      <span className="font-label-lg text-sm font-semibold">{request?.location || 'West Wing Station Ready'}</span>
                    </div>
                    <span className="font-label-caps text-label-caps text-[#56f9f9] bg-[#004f50]/80 px-2.5 py-0.5 rounded-full font-bold">
                      {summary?.zoneMatch || 'Zone 4A'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: AI Support Summary Card */}
            <div className="lg:col-span-7 flex flex-col gap-6 relative">
              
              {/* Fluid Ribbon background accent */}
              <div className="absolute -top-12 -right-8 w-64 h-64 opacity-25 lg:opacity-40 pointer-events-none mix-blend-multiply flex items-center justify-center">
                <img
                  alt="Fluid cyan transparent dimensional ribbon"
                  className="w-full h-full object-contain filter drop-shadow-[0_16px_24px_rgba(0,210,211,0.3)]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqOOp2EnGcDe2KB3nf9pT87H6a0fy_08ozoQh2nMXsf4aXzveWC3481oxz2fIoq2cwganyYIz79miMiZ1r_QvtsZhEIG-J6ot8TYiVEaGdKpsZ40-S2QvQfs3-xrda2f3OobVfMg_oq-XZf2TkNXHgvhpvyaEWMGy-5JlVII9M4FiyVAFZazmJVZgMD1r1gD-3oLYiCKJop-k8Li-PtPEib9laGXK4dHEprJCJVVvBDEIOrV9uVDi1Bw"
                />
              </div>

              <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl p-6 lg:p-8 shadow-[0_12px_32px_-4px_rgba(10,15,29,0.06),0_2px_6px_0_rgba(10,15,29,0.02)] border border-white flex flex-col gap-6 overflow-hidden">
                
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-full bg-[#00d2d3]/20 text-[#006a6a]">
                      <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps text-[#006a6a] uppercase font-bold tracking-wide">
                        AI Support Summary
                      </span>
                      <span className="font-body-sm text-xs text-[#64748B]">Synthesized For Administrative Organization</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-[#f2f3ff] px-3.5 py-1.5 rounded-full w-fit">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        request?.urgency === 'urgent'
                          ? 'bg-[#F43F5E]'
                          : request?.urgency === 'soon'
                          ? 'bg-[#F59E0B]'
                          : 'bg-[#10B981]'
                      }`}
                    ></span>
                    <span className="font-label-caps text-label-caps text-[#0A0F1D] uppercase font-bold">
                      Priority: {summary?.priority || request?.urgency || 'Normal'}
                    </span>
                  </div>
                </div>

                {/* Structured 2x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Category */}
                  <div className="bg-[#f2f3ff]/70 rounded-2xl p-4 flex flex-col justify-between shadow-xs border border-gray-100">
                    <div className="flex items-center justify-between text-[#64748B] mb-2">
                      <span className="font-label-caps text-label-caps uppercase font-bold">Category</span>
                      <span className="material-symbols-outlined text-[18px] text-[#006a6a]">groups</span>
                    </div>
                    <span className="font-headline-sm text-base text-[#0A0F1D] font-semibold">
                      {summary?.category || request?.category || 'Hospital Companion'}
                    </span>
                    <span className="font-body-sm text-xs text-[#64748B] mt-1">Bedside presence &amp; navigation</span>
                  </div>

                  {/* Scheduled Window */}
                  <div className="bg-[#f2f3ff]/70 rounded-2xl p-4 flex flex-col justify-between shadow-xs border border-gray-100">
                    <div className="flex items-center justify-between text-[#64748B] mb-2">
                      <span className="font-label-caps text-label-caps uppercase font-bold">Scheduled Window</span>
                      <span className="material-symbols-outlined text-[18px] text-[#006398]">calendar_today</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-headline-sm text-sm text-[#0A0F1D] font-medium">
                        {summary?.date || request?.preferredDate || 'Tomorrow'}
                      </span>
                      <span className="font-headline-md text-base text-[#006a6a] font-bold">
                        {summary?.time || request?.preferredTime || '10:00 AM'}
                      </span>
                    </div>
                    <span className="font-body-sm text-xs text-[#64748B] mt-1">Estimated duration: ~2.5 hrs</span>
                  </div>

                  {/* Main Requirement */}
                  <div className="md:col-span-2 bg-[#f2f3ff]/70 rounded-2xl p-5 flex flex-col gap-2 shadow-xs border border-gray-100">
                    <div className="flex items-center justify-between text-[#64748B]">
                      <span className="font-label-caps text-label-caps uppercase font-bold">Main Requirement</span>
                      <span className="font-label-caps text-label-caps text-[#006a6a] bg-[#56f9f9]/30 px-2.5 py-0.5 rounded-full font-bold">
                        Civic Aid Tier 1
                      </span>
                    </div>
                    <p className="font-body-lead text-sm text-[#0A0F1D] font-medium leading-relaxed">
                      {summary?.requirement || request?.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="px-2.5 py-1 rounded-full bg-white text-[#64748B] font-body-sm text-xs flex items-center gap-1 border border-gray-200 shadow-xs">
                        <span className="material-symbols-outlined text-[14px] text-[#006a6a]">wheelchair_pickup</span> Wheelchair assistance ready
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white text-[#64748B] font-body-sm text-xs flex items-center gap-1 border border-gray-200 shadow-xs">
                        <span className="material-symbols-outlined text-[14px] text-[#006a6a]">translate</span> English speaker
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white text-[#64748B] font-body-sm text-xs flex items-center gap-1 border border-gray-200 shadow-xs">
                        <span className="material-symbols-outlined text-[14px] text-[#006a6a]">alarm</span> Check-in: 15m prior
                      </span>
                    </div>
                  </div>

                  {/* Facility Designation */}
                  <div className="md:col-span-2 bg-[#f2f3ff]/70 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#cce5ff] text-[#004b73] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">apartment</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-caps text-label-caps text-[#64748B] uppercase font-bold">Facility Designation</span>
                        <span className="font-headline-sm text-sm text-[#0A0F1D] font-semibold">
                          {summary?.location || request?.location || 'City Hospital, West Wing'}
                        </span>
                        <span className="font-body-sm text-xs text-[#64748B]">Entrance Gate 3 • Diagnostic Pavilion Ground Floor</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full self-stretch sm:self-auto justify-center border border-gray-200 shadow-xs">
                      <span className="material-symbols-outlined text-[#006a6a] text-[16px]">navigation</span>
                      <span className="font-label-caps text-label-caps text-[#0A0F1D] uppercase font-bold">
                        Bay #12 Matched
                      </span>
                    </div>
                  </div>

                </div>

                {/* Volunteer Auto-Routing Parameters */}
                <div className="flex flex-col gap-1.5 bg-[#eaedff]/70 rounded-2xl p-4 border border-[#eaedff]">
                  <div className="flex items-center gap-1.5 text-[#64748B]">
                    <span className="material-symbols-outlined text-[16px] text-[#006a6a]">neurology</span>
                    <span className="font-label-caps text-label-caps uppercase font-bold">Volunteer Auto-Routing Parameters</span>
                  </div>
                  <p className="font-body-sm text-xs text-[#64748B] leading-relaxed">
                    AI extraction identified mild mobility fatigue, no oxygen supply required, verified companion pass required at reception desk. Summary dispatched to vetted on-call neighborhood volunteers within 2.4 miles.
                  </p>
                </div>

                {/* Operational Notice */}
                <div className="rounded-2xl bg-[#F43F5E]/5 p-4 flex items-start gap-3 border border-[#F43F5E]/20">
                  <span className="material-symbols-outlined text-[#F43F5E] text-[20px] shrink-0 mt-0.5">info</span>
                  <p className="font-body-sm text-xs text-[#161b2a] leading-relaxed">
                    <strong className="font-semibold text-[#0A0F1D]">CareConnect Operational Notice:</strong> AI analyzes incoming requests strictly to help civic coordinators quickly assign vetted volunteers. AI does not diagnose conditions, interpret lab values, or make clinical decisions.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                  <Link
                    to="/request-support"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#eaedff] text-[#0A0F1D] font-label-lg text-sm hover:bg-[#dee2f6] transition-all gap-2 group font-semibold"
                  >
                    <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">edit</span>
                    <span>Edit Request</span>
                  </Link>

                  <button
                    onClick={handleContinue}
                    disabled={isContinuing}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#0A0F1D] text-white font-label-lg text-sm hover:bg-[#006398] transition-all shadow-md hover:shadow-lg gap-3 group font-semibold"
                  >
                    {isContinuing ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                        <span>Finalizing Transmission...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to Confirmation</span>
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                          <span className="material-symbols-outlined text-[16px] text-white">arrow_forward</span>
                        </div>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Bottom 3 Bento Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 shadow-xs border border-white">
                  <div className="w-9 h-9 rounded-full bg-[#00d2d3]/20 text-[#006a6a] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">timer</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-[#64748B] uppercase font-bold">Avg Assignment</span>
                    <span className="font-tabular-stat text-base text-[#0A0F1D] font-semibold">~18 mins</span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 shadow-xs border border-white">
                  <div className="w-9 h-9 rounded-full bg-[#5bb8fe]/20 text-[#006398] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-[#64748B] uppercase font-bold">Screened Helpers</span>
                    <span className="font-tabular-stat text-base text-[#0A0F1D] font-semibold">100% Vetted</span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 shadow-xs border border-white">
                  <div className="w-9 h-9 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-[#64748B] uppercase font-bold">Encryption</span>
                    <span className="font-tabular-stat text-base text-[#0A0F1D] font-semibold">256-bit AES</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
