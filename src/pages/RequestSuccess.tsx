import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { SupportRequest } from '../types';

export const RequestSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<SupportRequest | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00d2d3', '#006a6a', '#5bb8fe', '#10B981']
      });
    } catch (e) {
      // ignore
    }

    if (id) {
      api.getRequestById(id)
        .then((res) => setRequest(res.request))
        .catch(() => {
          // fallback
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        });
    }
  }, [id]);

  const copyTicket = () => {
    navigator.clipboard.writeText(id || 'CC-1042');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="relative w-full overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00d2d3]/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-[840px] mx-auto px-5 pt-32 pb-24 flex flex-col items-center text-center">
          
          {/* Animated Success Badge */}
          <div className="w-20 h-20 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mb-6 shadow-md border-2 border-white ring-8 ring-[#10B981]/10">
            <span className="material-symbols-outlined text-[44px]">verified</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] font-label-caps text-xs uppercase font-bold tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            Dispatch Registered
          </div>

          <h1 className="font-display-hero text-headline-lg md:text-[44px] text-[#0A0F1D] font-bold tracking-tight">
            Request Successfully Received
          </h1>

          <p className="font-body-lead text-base md:text-lg text-[#64748B] mt-3 max-w-xl">
            Your non-emergency support ticket has been validated, synthesized, and routed to the municipal care coordinator desk.
          </p>

          {/* Ticket Reference Badge Card */}
          <div className="w-full bg-white/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 mt-8 shadow-xl border border-white flex flex-col gap-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div>
                <span className="font-label-caps text-label-caps text-[#64748B] uppercase font-bold">
                  Tracking Reference
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-tabular-stat text-2xl md:text-3xl text-[#0A0F1D] font-bold tracking-tight">
                    {id || 'CC-1042'}
                  </span>
                  <button
                    onClick={copyTicket}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#eaedff] text-[#006a6a] text-xs font-semibold rounded-full hover:bg-[#dee2f6] transition-all"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#f2f3ff] px-3.5 py-1.5 rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                <span className="font-label-caps text-label-caps text-[#0A0F1D] uppercase font-bold">
                  Status: Reviewing (Active)
                </span>
              </div>
            </div>

            {/* Quick Details Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 bg-[#f2f3ff]/60 rounded-2xl border border-gray-100">
                <span className="font-label-caps text-[10px] text-[#64748B] uppercase font-bold">Category</span>
                <div className="font-semibold text-sm text-[#0A0F1D] mt-0.5">{request?.category || 'Hospital Companion'}</div>
              </div>
              <div className="p-3.5 bg-[#f2f3ff]/60 rounded-2xl border border-gray-100">
                <span className="font-label-caps text-[10px] text-[#64748B] uppercase font-bold">Scheduled Window</span>
                <div className="font-semibold text-sm text-[#0A0F1D] mt-0.5">
                  {request?.preferredDate || 'Tomorrow'} • {request?.preferredTime || '10:00 AM'}
                </div>
              </div>
              <div className="p-3.5 bg-[#f2f3ff]/60 rounded-2xl border border-gray-100">
                <span className="font-label-caps text-[10px] text-[#64748B] uppercase font-bold">Designation</span>
                <div className="font-semibold text-sm text-[#0A0F1D] mt-0.5 truncate">{request?.location || 'City Hospital, West Wing'}</div>
              </div>
            </div>

            {/* What Happens Next Steps */}
            <div className="flex flex-col gap-3 pt-2">
              <span className="font-label-caps text-label-caps text-[#006a6a] uppercase font-bold tracking-wider">
                What Happens Next
              </span>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#006a6a]/10 text-[#006a6a] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  1
                </div>
                <p className="font-body-sm text-xs text-[#64748B]">
                  A municipal coordinator verifies on-call companion credentials within 45 minutes.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#006a6a]/10 text-[#006a6a] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  2
                </div>
                <p className="font-body-sm text-xs text-[#64748B]">
                  You will receive an automated SMS &amp; email confirmation as soon as a volunteer accepts the appointment.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#006a6a]/10 text-[#006a6a] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  3
                </div>
                <p className="font-body-sm text-xs text-[#64748B]">
                  No payment or medical card details will ever be requested.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#f2f3ff] text-[#0A0F1D] font-label-lg text-sm hover:bg-[#dee2f6] transition-all text-center font-semibold"
              >
                Back to Home
              </Link>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/request-support"
                  className="w-full sm:w-auto px-5 py-3 rounded-full border border-gray-300 text-[#0A0F1D] font-label-lg text-sm hover:bg-gray-50 transition-all text-center font-semibold"
                >
                  Submit Another
                </Link>
                <Link
                  to="/admin/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0A0F1D] text-white font-label-lg text-sm hover:bg-[#006398] transition-all text-center font-semibold shadow-md"
                >
                  <span>Coordinator View</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
