import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export const Volunteer: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    experience: 'none',
    introNote: '',
    termsAgree: false,
    backgroundAgree: false
  });

  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    'Transportation',
    'Hospital Companion'
  ]);

  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([
    'Weekdays',
    'Morning (8am - 12pm)'
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportAreasList = [
    {
      id: 'Transportation',
      icon: 'directions_car',
      title: 'Transportation',
      desc: 'Rides to non-urgent medical checkups'
    },
    {
      id: 'Hospital Companion',
      icon: 'handshake',
      title: 'Hospital Companion',
      desc: 'Sitting with patients during wait periods'
    },
    {
      id: 'Elderly Assistance',
      icon: 'elderly',
      title: 'Elderly Assistance',
      desc: 'Grocery pickups, social check-in calls'
    },
    {
      id: 'Accessibility Aid',
      icon: 'accessible_forward',
      title: 'Accessibility Aid',
      desc: 'Door-to-door physical guidance'
    },
    {
      id: 'General Support',
      icon: 'volunteer_activism',
      title: 'General Support',
      desc: 'Disaster relief kits, wellness packing, phone hotline routing',
      wide: true
    }
  ];

  const availabilityOptions = [
    'Weekdays',
    'Weekends',
    'Morning (8am - 12pm)',
    'Afternoon (12pm - 5pm)',
    'Evening (5pm - 9pm)'
  ];

  const toggleArea = (areaId: string) => {
    setSelectedAreas((prev) =>
      prev.includes(areaId) ? prev.filter((a) => a !== areaId) : [...prev, areaId]
    );
  };

  const toggleAvailability = (opt: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(opt) ? prev.filter((a) => a !== opt) : [...prev, opt]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedAreas.length === 0) {
      setError('Please select at least one support category.');
      return;
    }
    if (selectedAvailability.length === 0) {
      setError('Please select your typical availability.');
      return;
    }
    if (!formData.termsAgree || !formData.backgroundAgree) {
      setError('Please acknowledge the commitment and trust guidelines.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createVolunteer({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        supportAreas: selectedAreas,
        availability: selectedAvailability,
        experience: formData.experience,
        introNote: formData.introNote
      });

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setSuccess(true);
      setIsSubmitting(false);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="relative w-full max-w-[1360px] mx-auto px-5 md:px-10 pt-28 md:pt-36 pb-20 overflow-hidden">
        
        {/* Subtle Ambient Glow Orbs */}
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-[#00d2d3]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-[#5bb8fe]/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Editorial Header Stack */}
        <div className="pt-4 pb-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#eaedff] rounded-full mb-3 shadow-xs border border-white">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="font-label-caps text-label-caps text-[#0A0F1D] uppercase tracking-wider font-semibold">
              Civic Care Network • Intake Active
            </span>
          </div>
          <h1 className="font-display-hero text-headline-lg md:text-display-hero text-[#0A0F1D] tracking-tight">
            Turn your time <br className="hidden sm:inline" />
            <span className="text-[#006a6a]">into support.</span>
          </h1>
          <p className="font-body-lead text-body-lead text-[#64748B] mt-2 max-w-2xl">
            Register as a CareConnect volunteer and let coordinators know how you can help community members in need with everyday mobility, companionship, and localized civic care.
          </p>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Primary Intake Form Panel */}
          <div className="lg:col-span-8 bg-white/90 backdrop-blur-2xl rounded-3xl p-6 md:p-10 shadow-[0_12px_32px_-4px_rgba(10,15,29,0.06),0_2px_6px_0_rgba(10,15,29,0.02)] border border-white">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              
              {/* SECTION 01 */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-label-caps text-label-caps text-[#006a6a] uppercase font-bold tracking-widest">
                      Section 01
                    </span>
                    <span className="text-[#bacac9]">•</span>
                    <h2 className="font-headline-sm text-headline-sm text-[#0A0F1D]">Personal Information</h2>
                  </div>
                  <span className="font-label-caps text-label-caps text-[#64748B]">Required fields</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-lg text-label-lg text-[#0A0F1D] font-medium" htmlFor="fullName">
                      Full Legal Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Elena Rostova"
                      className="h-[52px] px-4 rounded-2xl bg-[#f2f3ff]/60 text-[#0A0F1D] font-body-default text-body-default focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#00d2d3] border border-gray-200 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-lg text-label-lg text-[#0A0F1D] font-medium" htmlFor="v-email">
                      Email Address
                    </label>
                    <input
                      id="v-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="elena.care@network.org"
                      className="h-[52px] px-4 rounded-2xl bg-[#f2f3ff]/60 text-[#0A0F1D] font-body-default text-body-default focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#00d2d3] border border-gray-200 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-lg text-label-lg text-[#0A0F1D] font-medium" htmlFor="v-phone">
                      Phone Number
                    </label>
                    <input
                      id="v-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 439-0129"
                      className="h-[52px] px-4 rounded-2xl bg-[#f2f3ff]/60 text-[#0A0F1D] font-body-default text-body-default focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#00d2d3] border border-gray-200 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-lg text-label-lg text-[#0A0F1D] font-medium" htmlFor="v-city">
                      City / Municipal Ward
                    </label>
                    <input
                      id="v-city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Metro District 4, North Hills"
                      className="h-[52px] px-4 rounded-2xl bg-[#f2f3ff]/60 text-[#0A0F1D] font-body-default text-body-default focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#00d2d3] border border-gray-200 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 02 */}
              <div className="flex flex-col gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-label-caps text-[#006a6a] uppercase font-bold tracking-widest">
                    Section 02
                  </span>
                  <span className="text-[#bacac9]">•</span>
                  <h2 className="font-headline-sm text-headline-sm text-[#0A0F1D]">Support Areas</h2>
                </div>
                <p className="font-body-sm text-body-sm text-[#64748B] -mt-2">
                  Select all categories where you feel comfortable lending hands-on non-clinical assistance.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {supportAreasList.map((area) => {
                    const isSelected = selectedAreas.includes(area.id);
                    return (
                      <button
                        type="button"
                        key={area.id}
                        onClick={() => toggleArea(area.id)}
                        className={`group flex flex-col items-start p-4 rounded-2xl text-left transition-all border ${
                          area.wide ? 'sm:col-span-2 md:col-span-2' : ''
                        } ${
                          isSelected
                            ? 'bg-[#0A0F1D] text-white border-[#0A0F1D] shadow-md'
                            : 'bg-[#f2f3ff]/60 text-[#161b2a] border-gray-200 hover:bg-[#eaedff]'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 mb-2 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-[#eaedff] text-[#006a6a]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">{area.icon}</span>
                        </div>
                        <span className="font-label-lg text-sm font-semibold">{area.title}</span>
                        <span
                          className={`font-body-sm text-xs mt-1 ${
                            isSelected ? 'text-gray-300' : 'text-[#64748B]'
                          }`}
                        >
                          {area.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 03 */}
              <div className="flex flex-col gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-label-caps text-[#006a6a] uppercase font-bold tracking-widest">
                    Section 03
                  </span>
                  <span className="text-[#bacac9]">•</span>
                  <h2 className="font-headline-sm text-headline-sm text-[#0A0F1D]">Availability</h2>
                </div>
                <p className="font-body-sm text-body-sm text-[#64748B] -mt-2">
                  Select times you are typically available on call or pre-scheduled.
                </p>

                <div className="flex flex-wrap gap-2">
                  {availabilityOptions.map((opt) => {
                    const isSelected = selectedAvailability.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleAvailability(opt)}
                        className={`px-4 py-2.5 rounded-full font-label-lg text-sm transition-all border ${
                          isSelected
                            ? 'bg-[#0A0F1D] text-white border-[#0A0F1D]'
                            : 'bg-[#eaedff]/70 text-[#0A0F1D] border-gray-200 hover:bg-[#dee2f6]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 04 */}
              <div className="flex flex-col gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-label-caps text-[#006a6a] uppercase font-bold tracking-widest">
                    Section 04
                  </span>
                  <span className="text-[#bacac9]">•</span>
                  <h2 className="font-headline-sm text-headline-sm text-[#0A0F1D]">Experience &amp; Background</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-lg text-label-lg text-[#0A0F1D] font-medium" htmlFor="expLevel">
                      Prior Volunteering / First Aid Background
                    </label>
                    <div className="relative">
                      <select
                        id="expLevel"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full h-[52px] appearance-none px-4 pr-10 rounded-2xl bg-[#f2f3ff]/60 text-[#0A0F1D] font-body-default text-body-default focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#00d2d3] border border-gray-200 transition-all cursor-pointer"
                      >
                        <option value="none">No formal experience (New to civic volunteering)</option>
                        <option value="community">Active community organizer / Neighborhood watch</option>
                        <option value="cpr">CPR / Basic Life Support certified</option>
                        <option value="nursing-student">Nursing / Pre-Med / Paramedic student</option>
                        <option value="retired-medical">Retired nurse or healthcare professional</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-3.5 text-gray-500 pointer-events-none">expand_more</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-lg text-label-lg text-[#0A0F1D] font-medium" htmlFor="introNote">
                      Short Introduction Note
                    </label>
                    <textarea
                      id="introNote"
                      rows={3}
                      value={formData.introNote}
                      onChange={(e) => setFormData({ ...formData, introNote: e.target.value })}
                      placeholder="Tell us why you want to support CareConnect, any languages spoken, or accessibility equipment you have access to..."
                      className="w-full p-4 rounded-2xl bg-[#f2f3ff]/60 text-[#0A0F1D] font-body-default text-body-default focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#00d2d3] border border-gray-200 transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* SECTION 05 */}
              <div className="flex flex-col gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-label-caps text-[#006a6a] uppercase font-bold tracking-widest">
                    Section 05
                  </span>
                  <span className="text-[#bacac9]">•</span>
                  <h2 className="font-headline-sm text-headline-sm text-[#0A0F1D]">Commitment &amp; Guidelines</h2>
                </div>

                <div className="p-4 bg-[#f2f3ff]/70 rounded-2xl flex flex-col gap-3 border border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={formData.termsAgree}
                      onChange={(e) => setFormData({ ...formData, termsAgree: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded text-[#006a6a] focus:ring-0 cursor-pointer accent-[#006a6a]"
                    />
                    <span className="font-body-sm text-body-sm text-[#161b2a]">
                      I commit to adhering to the CareConnect <strong className="text-[#0A0F1D]">Community Code of Conduct</strong> and strictly recognize that I will never provide clinical prescriptions, unauthorized invasive interventions, or operate outside designated civilian non-emergency bounds.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={formData.backgroundAgree}
                      onChange={(e) => setFormData({ ...formData, backgroundAgree: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded text-[#006a6a] focus:ring-0 cursor-pointer accent-[#006a6a]"
                    />
                    <span className="font-body-sm text-body-sm text-[#161b2a]">
                      I consent to standard identity verification and a municipal trust check to ensure community safety.
                    </span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-[#ffdad6] text-[#93000a] rounded-2xl text-sm font-medium border border-[#ba1a1a]/30">
                  {error}
                </div>
              )}

              {/* Submit CTA Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="font-body-sm text-body-sm text-[#64748B]">
                  Intake review takes ~24h • No registration fees
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0A0F1D] text-white font-headline-sm text-base rounded-full hover:bg-[#006398] transition-all shadow-[0_12px_24px_-4px_rgba(10,15,29,0.25)] group cursor-pointer disabled:opacity-50 font-semibold"
                >
                  <span>{isSubmitting ? 'Submitting Profile...' : 'Become a Volunteer'}</span>
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <span className="material-symbols-outlined text-white text-[18px]">arrow_forward</span>
                  </span>
                </button>
              </div>

            </form>

            {/* Form Success State Notification */}
            {success && (
              <div className="mt-6 p-6 bg-[#dee2f6]/70 rounded-2xl flex items-center gap-4 shadow-sm border border-[#00d2d3]/40 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">verified</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-base font-semibold text-[#0A0F1D]">Application Received!</h3>
                  <p className="font-body-sm text-body-sm text-[#64748B]">
                    A CareConnect district coordinator will review your profile and reach out via SMS/Email within 24 hours.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Adjacent Impact & Testimonial Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Impact Metric Bento Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_24px_-4px_rgba(10,15,29,0.04)] border border-white flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-[#64748B] uppercase font-bold tracking-wider">
                  District Impact Telemetry
                </span>
                <span className="material-symbols-outlined text-[#006a6a] text-[20px]">query_stats</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="flex flex-col p-4 bg-[#f2f3ff]/60 rounded-2xl border border-gray-100">
                  <span className="font-tabular-stat text-2xl text-[#0A0F1D] font-bold">67</span>
                  <span className="font-body-sm text-xs text-[#64748B] mt-1 leading-tight">Active Volunteers</span>
                  <div className="flex items-center gap-1 text-[#10B981] font-label-caps text-label-caps mt-2 font-bold">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    <span>+12% this wk</span>
                  </div>
                </div>

                <div className="flex flex-col p-4 bg-[#f2f3ff]/60 rounded-2xl border border-gray-100">
                  <span className="font-tabular-stat text-2xl text-[#006a6a] font-bold">120+</span>
                  <span className="font-body-sm text-xs text-[#64748B] mt-1 leading-tight">Families Supported</span>
                  <span className="font-label-caps text-label-caps text-[#64748B] mt-2">This month alone</span>
                </div>
              </div>

              {/* SVG Visual Donut */}
              <div className="p-4 bg-[#f2f3ff]/60 rounded-2xl flex items-center justify-between gap-4 border border-gray-100">
                <div className="flex flex-col">
                  <span className="font-label-lg text-sm text-[#161b2a] font-semibold">94.8% Match Rate</span>
                  <span className="font-body-sm text-xs text-[#64748B]">Requests paired under 45m</span>
                </div>
                <svg className="w-14 h-14 -rotate-90 shrink-0" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" fill="none" r="15.5" stroke="#e3e7fc" strokeWidth="3"></circle>
                  <circle
                    cx="18"
                    cy="18"
                    fill="none"
                    r="15.5"
                    stroke="#006a6a"
                    strokeDasharray="94.8, 100"
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></circle>
                </svg>
              </div>
            </div>

            {/* Featured Volunteer Photo / Testimonial Card */}
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_24px_-4px_rgba(10,15,29,0.04)] border border-white flex flex-col gap-4 overflow-hidden">
              <div className="flex items-center gap-4">
                <img
                  className="w-14 h-14 rounded-full object-cover shadow-sm shrink-0 ring-2 ring-[#00d2d3]/40"
                  alt="Marcus Chen volunteer portrait"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWcrntpsWExgY67LflLcEpszWvRZbZT7Sav9Ty2tTCrzkJJrgi5VZmyJKoTcTjZT4D2zXaUkgxG6wLpMTZY2HI4543lpzjoI-sJWlpcFraP5SWOpxy15lyg6xHCPucxt-tAEry7uw-7Bd5cKLWhsN8tUZNrQAFOJzHD4hzv8LS_7eO6W9y888YD9-hyrsTh-WhdK5tXdGt_InhDFK4AMQ-q3XwcldDMfjcpQZDkL8D-poI6_T1XU-lCw"
                />
                <div className="flex flex-col">
                  <h4 className="font-headline-sm text-base text-[#0A0F1D] font-bold leading-tight">Marcus Chen</h4>
                  <span className="font-body-sm text-xs text-[#64748B]">Companion Care Lead • 8 Mos</span>
                </div>
              </div>

              <div className="relative">
                <span className="material-symbols-outlined text-[#006a6a]/20 text-5xl absolute -top-3 -left-2 pointer-events-none select-none">
                  format_quote
                </span>
                <p className="font-body-default text-sm text-[#161b2a] italic relative z-10 pl-6 leading-relaxed">
                  "Being there to walk an elderly neighbor up the clinic steps or simply driving someone who has vision fatigue gives them back their autonomy. It takes two hours on a Saturday morning, but the reassurance it builds is immeasurable."
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[#64748B] font-body-sm text-xs border-t border-[#0A0F1D]/08">
                <span>Verified Civic Volunteer</span>
                <div className="flex items-center gap-1 text-[#006a6a]">
                  <span className="material-symbols-outlined text-[16px] text-[#00d2d3]">star</span>
                  <span className="font-bold text-[#0A0F1D]">5.0</span>
                  <span className="text-[#64748B]">(48 trips)</span>
                </div>
              </div>
            </div>

            {/* Community Dispatch Presence Map Preview */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-[0_8px_24px_-4px_rgba(10,15,29,0.04)] border border-white flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-label-caps text-label-caps text-[#64748B] uppercase font-bold tracking-wider">
                  Coverage Footprint
                </span>
                <span className="font-body-sm text-xs text-[#006a6a] font-bold">District Central</span>
              </div>
              <div
                className="w-full h-40 bg-cover bg-center rounded-2xl shadow-inner flex items-end p-3 relative overflow-hidden"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB6S1hoMeDPHIyOcZ6s0klocIohkcOpNo4IvQQ8xTnQLTr2QdEha9ZQlXwQfIO7733iUrxX6MxLMSD6jT_f2BDFaviZXjfI8ph3saKz2iOGM84Ag498-0XoT4srVOlQSrRSgPFwA2c0HJd5L1zmsgx00a3OzTfSygPVBMAWgYZxNims9TIyNHm7YR8IyRSsZ705Mc4IKG77ZP5Inaf8kjQ8K1ZD9Mx8g1MuZNxQRqn_FaEDiEKIARpaGw')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D]/80 via-transparent to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex items-center gap-2 text-white font-body-sm text-xs">
                  <span className="material-symbols-outlined text-[#00d2d3] text-[18px]">location_on</span>
                  <span>14 Active Support Hubs in City Zone</span>
                </div>
              </div>
            </div>

            {/* Emergency Note */}
            <div className="p-4 rounded-2xl bg-[#F43F5E]/10 flex items-start gap-2.5 border border-[#F43F5E]/20">
              <span className="material-symbols-outlined text-[#F43F5E] text-[20px] shrink-0 mt-0.5">info</span>
              <p className="font-body-sm text-xs text-[#161b2a] leading-relaxed">
                Volunteers are coordinated solely for supportive services. For urgent dispatch, users are instantly guided to direct emergency response personnel.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
