import React, { useState } from 'react';
import { api } from '../services/api';

export const MapsFacilityLocator: React.FC<{ onSelectFacility?: (address: string) => void }> = ({
  onSelectFacility
}) => {
  const [query, setQuery] = useState('Hospital companion entrance or outpatient clinic');
  const [location, setLocation] = useState('Downtown Health Sector');
  const [loading, setLoading] = useState(false);
  const [groundedSummary, setGroundedSummary] = useState<string | null>(null);
  const [facilities, setFacilities] = useState<Array<{
    name: string;
    type: string;
    address: string;
    distance?: string;
    accessibility?: string[];
    phone?: string;
    hours?: string;
    notes?: string;
  }>>([]);
  const [modelUsed, setModelUsed] = useState<string | null>(null);

  const handleSearch = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim() || loading) return;

    setLoading(true);
    try {
      const result = await api.searchFacilitiesWithMaps(q, location);
      setFacilities(result.facilities);
      setGroundedSummary(result.groundedSummary);
      setModelUsed(result.modelUsed);
    } catch (err) {
      console.error('Maps search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sampleSearches = [
    { label: 'Wheelchair Outpatient Clinics', q: 'Clinics with wheelchair accessible entrances and companion drop-off' },
    { label: 'City Hospitals with Patient Escort', q: 'Hospitals with patient navigation or ambulatory escort gates' },
    { label: 'Pharmacies with Drive-thru', q: 'Pharmacies with prescription drive-through and mobility access' }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-sm border border-white flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#006398]/10 text-[#006398] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">pin_drop</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline-sm text-lg font-bold text-[#0A0F1D]">
                Facility &amp; Healthcare Hub Locator
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#00d2d3]/20 text-[#006a6a] font-bold">
                Google Maps Grounding
              </span>
            </div>
            <p className="font-body-sm text-xs text-[#64748B]">
              Powered by gemini-3.5-flash with real-time location grounding and accessibility verification.
            </p>
          </div>
        </div>

        {modelUsed && (
          <span className="text-xs text-[#64748B] bg-[#f2f3ff] px-3 py-1 rounded-full font-medium self-start sm:self-auto">
            Grounding: {modelUsed}
          </span>
        )}
      </div>

      {/* Quick Search Chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        {sampleSearches.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setQuery(s.q);
              handleSearch(s.q);
            }}
            className="px-3 py-1.5 rounded-full bg-[#f2f3ff] text-[#0A0F1D] hover:bg-[#eaedff] border border-gray-200 transition-all font-medium"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-7 relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
            local_hospital
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search facility name, medical pavilion, or care need..."
            className="w-full h-12 pl-10 pr-4 rounded-2xl bg-[#F6F8FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00d2d3]"
          />
        </div>

        <div className="md:col-span-3 relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
            near_me
          </span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="District / City"
            className="w-full h-12 pl-10 pr-4 rounded-2xl bg-[#F6F8FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00d2d3]"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="button"
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="w-full h-12 rounded-2xl bg-[#0A0F1D] text-white font-semibold text-sm hover:bg-[#006398] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grounded Summary text */}
      {groundedSummary && (
        <div className="p-4 bg-[#f2f3ff]/80 rounded-2xl border border-[#dee2f6] text-xs text-[#161b2a] leading-relaxed flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[#006398] text-[18px] shrink-0 mt-0.5">info</span>
          <div>
            <span className="font-bold text-[#006398]">Grounded Location Summary: </span>
            {groundedSummary}
          </div>
        </div>
      )}

      {/* Facility Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilities.map((f, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#F6F8FA] border border-gray-200 hover:border-[#00d2d3] transition-all flex flex-col justify-between gap-3 shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-headline-sm text-sm font-bold text-[#0A0F1D] leading-snug">
                  {f.name}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white border border-gray-200 text-[#006a6a] font-bold shrink-0">
                  {f.type}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#006a6a]">place</span>
                <span>{f.address}</span>
              </div>

              {f.distance && (
                <div className="text-xs text-[#10B981] font-semibold mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">navigation</span>
                  {f.distance}
                </div>
              )}

              {/* Accessibility tags */}
              {f.accessibility && f.accessibility.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {f.accessibility.map((acc, aIdx) => (
                    <span
                      key={aIdx}
                      className="px-2 py-0.5 rounded-full text-[10px] bg-white text-gray-700 border border-gray-200 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[12px] text-[#006a6a]">check</span>
                      {acc}
                    </span>
                  ))}
                </div>
              )}

              {f.notes && (
                <p className="text-[11px] text-gray-500 mt-2 italic bg-white/60 p-2 rounded-xl border border-gray-100">
                  {f.notes}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-xs">
              <span className="text-gray-500 font-medium">
                {f.phone || f.hours || 'Verified municipal hub'}
              </span>
              {onSelectFacility && (
                <button
                  type="button"
                  onClick={() => onSelectFacility(`${f.name} (${f.address})`)}
                  className="px-3 py-1.5 rounded-xl bg-[#006a6a] text-white text-[11px] font-semibold hover:bg-[#005556] transition-all"
                >
                  Use for Request
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
