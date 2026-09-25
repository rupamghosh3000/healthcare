import React from 'react';

export const EmergencyBanner: React.FC = () => {
  return (
    <aside className="w-full bg-[#F43F5E]/10 backdrop-blur-md shadow-[0_1px_8px_rgba(244,63,94,0.06)] border-b border-[#F43F5E]/20 relative z-50">
      <div className="max-w-[1360px] mx-auto px-5 md:px-10 py-1.5 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#F43F5E] text-[20px] shrink-0">warning</span>
          <p className="font-body-sm text-body-sm text-[#161b2a]">
            <span className="font-label-caps text-label-caps text-[#F43F5E] uppercase mr-1.5 font-bold tracking-wider">Emergency Disclaimer:</span>
            CareConnect is strictly for non-emergency medical navigation and municipal care support. If you are experiencing a life-threatening crisis, call <span className="font-headline-sm text-body-sm text-[#F43F5E] font-bold">911</span> immediately.
          </p>
        </div>
        <a
          className="hidden sm:inline-flex items-center gap-1 font-label-caps text-label-caps text-[#F43F5E] hover:underline uppercase font-bold tracking-wider shrink-0"
          href="tel:911"
        >
          <span className="material-symbols-outlined text-[16px]">call</span>
          Emergency Services
        </a>
      </div>
    </aside>
  );
};
