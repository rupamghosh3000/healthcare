import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { MapsFacilityLocator } from '../components/MapsFacilityLocator';

export const RequestSupport: React.FC = () => {
  const navigate = useNavigate();
  const [showMapsLocator, setShowMapsLocator] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    description: '',
    urgency: 'normal',
    consent: false
  });

  const [charCount, setCharCount] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressPercent, setProgressPercent] = useState(25);
  const [statusMessage, setStatusMessage] = useState('Initiating secure gateway...');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === 'description') {
        setCharCount(value.length);
      }
    }

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your full name (minimum 2 characters).';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      errs.phone = 'Please enter a valid phone number.';
    }
    if (!formData.category) {
      errs.category = 'Please select a support category.';
    }
    if (!formData.preferredDate) {
      errs.preferredDate = 'Please select a preferred date.';
    }
    if (!formData.preferredTime) {
      errs.preferredTime = 'Please select a time window.';
    }
    if (!formData.location.trim()) {
      errs.location = 'Please specify pickup or destination location.';
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errs.description = 'Please describe the support you need (minimum 10 characters).';
    }
    if (!formData.consent) {
      errs.consent = 'You must agree to civilian non-emergency terms.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // scroll to first error
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setProgressPercent(30);
    setStatusMessage('Validating intake telemetry & location match...');

    const progressInterval = setInterval(() => {
      setProgressPercent((p) => (p < 85 ? p + 15 : p));
    }, 300);

    try {
      const response = await api.createRequest({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        location: formData.location,
        description: formData.description,
        urgency: formData.urgency,
        consent: formData.consent
      });

      clearInterval(progressInterval);
      setProgressPercent(100);
      setStatusMessage('AI Synthesis Complete. Redirecting to dispatch summary...');

      setTimeout(() => {
        navigate(`/request-processing/${response.request.id}`);
      }, 500);
    } catch (err: any) {
      clearInterval(progressInterval);
      setIsSubmitting(false);
      alert(err.message || 'Something went wrong while submitting your request.');
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full overflow-hidden">
        {/* Glow ambient background orbs */}
        <div className="absolute -top-32 right-[-8%] w-[640px] h-[640px] rounded-full bg-gradient-to-br from-[#56f9f9]/20 via-[#acedff]/15 to-transparent blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-[40%] -left-36 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#cce5ff]/25 via-[#00d2d3]/10 to-transparent blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-[1360px] mx-auto px-5 md:px-10 pt-28 md:pt-36 pb-20">
          {/* Main Asymmetric Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Editorial Guide Column */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-36">
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaedff]/80 w-fit text-[#006a6a] border border-white">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-[#006a6a] font-bold">
                    Civic Intake Protocol 2.4
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-[#0A0F1D] font-semibold tracking-tight">
                  Tell us what support you need.
                </h1>
                <p className="font-body-lead text-body-lead text-[#64748B]">
                  Share the details below so your request can be organized, prioritized, and reviewed by municipal care navigators.
                </p>
              </div>

              {/* Luminous 3D Glass Artwork Accent */}
              <div className="relative w-full aspect-square max-h-[340px] rounded-3xl overflow-hidden bg-gradient-to-br from-white/80 via-white/50 to-[#56f9f9]/20 backdrop-blur-xl shadow-xs border border-white flex items-center justify-center p-6">
                <img
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,106,106,0.18)]"
                  alt="Translucent 3D flowing spiral ribbon of liquid glass and soft cyan waves"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3_gXx0XJ88jmpOaufCTOhCqlTVREfwQBl4WdfLBVcYjRvfIQymo5qZ4S-KVQhmutneZLA3CgPbh3QY5SSS_SLRM1vVOfuYLOYKDXiNJ5PRCDHeJH8cEgd6mv79pHTNthIF_-IBkJaMCNRtpxZUhShlQgYqkETuvTaCvDFZNZD3Pj1mfgIgQelrf4CRHGrBIpzeNEWUkrnr2-cbBntQXmAXAy9KIkWKtzOW9AnFIim3u5Pf8MEUkQm3g"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/85 backdrop-blur-xl rounded-2xl p-3 shadow-xs border border-white/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                    <span className="font-body-sm text-body-sm text-[#3b4949]">
                      Live Dispatch Telemetry: <strong className="text-[#0A0F1D] font-medium">Active</strong>
                    </span>
                  </div>
                  <span className="font-label-caps text-label-caps text-[#64748B] font-semibold">Avg. Review 18m</span>
                </div>
              </div>

              {/* Tips for swift allocation */}
              <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-xs border border-white/80 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[#0A0F1D]">
                  <span className="material-symbols-outlined text-[#006a6a] text-[20px]">lightbulb</span>
                  <span className="font-label-lg text-label-lg font-semibold">Tips for swift allocation</span>
                </div>
                <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-[#64748B]">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#006a6a] text-[16px] mt-0.5">check_circle</span>
                    <span>Specify mobility or equipment needs (e.g., walker, wheelchair accessible van).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#006a6a] text-[16px] mt-0.5">check_circle</span>
                    <span>Provide alternate times if appointment scheduling is flexible.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#006a6a] text-[16px] mt-0.5">check_circle</span>
                    <span>Care coordinators never ask for social security or credit card numbers.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Core Multi-Section Intake Form Container */}
            <div className="lg:col-span-8">
              <form
                onSubmit={handleSubmit}
                className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-[0_16px_40px_-8px_rgba(10,15,29,0.06),0_2px_8px_0_rgba(10,15,29,0.02)] border border-white flex flex-col gap-8"
              >
                
                {/* SECTION 01: YOUR DETAILS */}
                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-caps text-label-caps text-[#006a6a] uppercase font-bold tracking-widest bg-[#56f9f9]/30 px-2 py-0.5 rounded-full">
                        01
                      </span>
                      <h2 className="font-headline-sm text-headline-sm text-[#0A0F1D] font-semibold">Your Details</h2>
                    </div>
                    <span className="font-body-sm text-body-sm text-[#64748B]">Confidential Contact Info</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="font-label-lg text-label-lg text-[#0A0F1D] font-medium flex items-center justify-between" htmlFor="name">
                        <span>Full Name <span className="text-[#F43F5E]">*</span></span>
                        <span className="font-body-sm text-body-sm text-[#64748B]">Legal or preferred</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">person</span>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Eleanor Vance"
                          className="w-full h-[52px] pl-12 pr-4 rounded-2xl bg-[#f2f3ff]/60 text-[#0A0F1D] font-body-default text-body-default placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d2d3] border border-gray-200 transition-all"
                        />
                      </div>
                      {errors.name && <span className="text-xs text-[#F43F5E] font-medium">{errors.name}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-lg text-label-lg text-[#0A0F1D] font-medium" htmlFor="email">
                        Email Address <span className="text-[#F43F5E]">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">mail</span>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="eleanor@example.org"
                          className="w-full h-[52px] pl-12 pr-4 rounded-2xl bg-[#f2f3ff]/60 text-[#0A0F1D] font-body-default text-body-default placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d2d3] border border-gray-200 transition-all"
                        />
                      </div>
                      {errors.email && <span className="text-xs text-[#F43F5E] font-medium">{errors.email}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-lg text-label-lg text-[#0A0F1D] font-medium" htmlFor="phone">
                        Phone Number <span className="text-[#F43F5E]">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">call</span>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(555) 234-8901"
                          className="w-full h-[52px] pl-12 pr-4 rounded-2xl bg-[#f2f3ff]/60 text-[#0A0F1D] font-body-default text-body-default placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d2d3] border border-gray-200 transition-all"
                        />
                      </div>
                      {errors.phone && <span className="text-xs text-[#F43F5E] font-medium">{errors.phone}</span>}
                    </div>
                  </div>
                </section>

                <div className="w-full h-px bg-[#dee2f6]"></div>

                {/* SECTION 02: SUPPORT DETAILS */}
                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-caps text-label-caps text-[#006a6a] uppercase font-bold tracking-widest bg-[#56f9f9]/30 px-2 py-0.5 rounded-full">
                        02
                      </span>
                      <h2 className="font-headline-sm text-headline-sm text-[#0A0F1D] font-semibold">Support Details</h2>
                    </div>
                    <span className="font-body-sm text-body-sm text-[#64748B]">Type &amp; Logistics</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="font-label-lg text-label-lg text-[#0A0F1D] font-medium" htmlFor="category">
                        Support Category <span className="text-[#F43F5E]">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">category</span>
                        <select
                          id="category"
                          name="category"
                          required
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full h-[52px] pl-12 pr-10 rounded-2xl bg-[#f2f3ff]/60 text-[#0A0F1D] font-body-default text-body-default appearance-none focus:outline-none focus:ring-2 focus:ring-[#00d2d3] border border-gray-200 transition-all cursor-pointer"
                        >
                          <option value="">Select care or assistance category</option>
                          <option value="Hospital Companion">Hospital Companion</option>
                          <option value="Hospital Assistance">Hospital Assistance</option>
                          <option value="Transportation">Transportation Assistance</option>
                          <option value="Elderly Support">Elderly Support</option>
                          <option value="Accessibility Assistance">Accessibility Assistance</option>
                          <option value="Companion Support">Companion Support</option>
                          <option value="General Support">General Support</option>
                          <option value="Other">Other Community Need</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[20px]">expand_more</span>
                      </div>
                      {errors.category && <span className="text-xs text-[#F43F5E] font-medium">{errors.category}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-lg text-label-lg text-[#0A0F1D] font-medium" htmlFor="preferredDate">
                        Preferred Date <span className="text-[#F43F5E]">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">calendar_today</span>
                        <input
                          id="preferredDate"
                          name="preferredDate"
                          type="date"
                          required
                          value={formData.preferredDate}
                          onChange={handleChange}
                          className="w-full h-[52px] pl-12 pr-4 rounded-2xl bg-[#f2f3ff]/60 text-[#0A0F1D] font-body-default text-body-default focus:outline-none focus:ring-2 focus:ring-[#00d2d3] border border-gray-200 transition-all"
                        />
                      </div>
                      {errors.preferredDate && <span className="text-xs text-[#F43F5E] font-medium">{errors.preferredDate}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-lg text-label-lg text-[#0A0F1D] font-medium" htmlFor="preferredTime">
                        Preferred Time Window <span className="text-[#F43F5E]">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">schedule</span>
                        <select
                          id="preferredTime"
                          name="preferredTime"
                          required
                          value={formData.preferredTime}
                          onChange={handleChange}
                          className="w-full h-[52px] pl-12 pr-10 rounded-2xl bg-[#f2f3ff]/60 text-[#0A0F1D] font-body-default text-body-default appearance-none focus:outline-none focus:ring-2 focus:ring-[#00d2d3] border border-gray-200 transition-all cursor-pointer"
                        >
                          <option value="">Select window</option>
                          <option value="10:00 AM">Morning (10:00 AM)</option>
                          <option value="Morning (8:00 AM – 12:00 PM)">Morning (8:00 AM – 12:00 PM)</option>
                          <option value="Afternoon (12:00 PM – 4:00 PM)">Afternoon (12:00 PM – 4:00 PM)</option>
                          <option value="Evening (4:00 PM – 8:00 PM)">Evening (4:00 PM – 8:00 PM)</option>
                          <option value="Flexible / Any time">Flexible / Any time</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[20px]">expand_more</span>
                      </div>
                      {errors.preferredTime && <span className="text-xs text-[#F43F5E] font-medium">{errors.preferredTime}</span>}
                    </div>

                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-label-lg text-label-lg text-[#0A0F1D] font-medium" htmlFor="location">
                          Pickup / Service Location <span className="text-[#F43F5E]">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowMapsLocator(!showMapsLocator)}
                          className="inline-flex items-center gap-1.5 text-xs text-[#006398] hover:text-[#00476e] font-semibold bg-[#cce5ff]/50 hover:bg-[#cce5ff] px-3 py-1 rounded-full transition-all"
                        >
                          <span className="material-symbols-outlined text-[15px]">pin_drop</span>
                          <span>{showMapsLocator ? 'Close Maps Locator' : 'Find with Google Maps'}</span>
                        </button>
                      </div>

                      {showMapsLocator && (
                        <div className="my-2 p-2 bg-[#f2f3ff]/60 rounded-3xl border border-[#00d2d3]/40">
                          <MapsFacilityLocator
                            onSelectFacility={(addr) => {
                              setFormData((prev) => ({ ...prev, location: addr }));
                              setShowMapsLocator(false);
                            }}
                          />
                        </div>
                      )}

                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">location_on</span>
                        <input
                          id="location"
                          name="location"
                          type="text"
                          required
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g. City Hospital, West Wing (Entrance Gate 3)"
                          className="w-full h-[52px] pl-12 pr-4 rounded-2xl bg-[#f2f3ff]/60 text-[#0A0F1D] font-body-default text-body-default placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d2d3] border border-gray-200 transition-all"
                        />
                      </div>
                      {errors.location && <span className="text-xs text-[#F43F5E] font-medium">{errors.location}</span>}
                    </div>
                  </div>
                </section>

                <div className="w-full h-px bg-[#dee2f6]"></div>

                {/* SECTION 03: YOUR REQUEST */}
                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-caps text-label-caps text-[#006a6a] uppercase font-bold tracking-widest bg-[#56f9f9]/30 px-2 py-0.5 rounded-full">
                        03
                      </span>
                      <h2 className="font-headline-sm text-headline-sm text-[#0A0F1D] font-semibold">Your Request</h2>
                    </div>
                    <span className="font-body-sm text-body-sm text-[#64748B]">Detailed Context</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-lg text-label-lg text-[#0A0F1D] font-medium" htmlFor="description">
                      Please describe the support you need... <span className="text-[#F43F5E]">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="description"
                        name="description"
                        rows={5}
                        required
                        value={formData.description}
                        onChange={handleChange}
                        maxLength={1000}
                        placeholder="Provide relevant details: e.g., need someone to accompany patient through ambulatory check-in, waiting room transitions, and pharmacy collection. Mild mobility fatigue, no oxygen required."
                        className="w-full p-4 rounded-2xl bg-[#f2f3ff]/60 text-[#0A0F1D] font-body-default text-body-default placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d2d3] border border-gray-200 transition-all resize-y"
                      ></textarea>
                    </div>
                    <div className="flex items-center justify-between px-1">
                      <span className="font-body-sm text-body-sm text-[#64748B] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-[#006a6a]">auto_awesome</span>
                        Real-time AI summarizes this for swift responder briefing.
                      </span>
                      <span className={`font-body-sm text-body-sm ${charCount > 950 ? 'text-[#F43F5E]' : 'text-[#64748B]'}`}>
                        {charCount} / 1000
                      </span>
                    </div>
                    {errors.description && <span className="text-xs text-[#F43F5E] font-medium">{errors.description}</span>}
                  </div>
                </section>

                <div className="w-full h-px bg-[#dee2f6]"></div>

                {/* SECTION 04: URGENCY CLASSIFICATION */}
                <section className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-caps text-label-caps text-[#006a6a] uppercase font-bold tracking-widest bg-[#56f9f9]/30 px-2 py-0.5 rounded-full">
                        04
                      </span>
                      <h2 className="font-headline-sm text-headline-sm text-[#0A0F1D] font-semibold">Urgency Classification</h2>
                    </div>
                    <span className="font-body-sm text-body-sm text-[#F43F5E] font-medium">Non-clinical prioritization</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Routine */}
                    <label
                      className={`cursor-pointer relative flex flex-col p-4 rounded-2xl transition-all border ${
                        formData.urgency === 'normal'
                          ? 'bg-[#0A0F1D] text-white border-[#0A0F1D] shadow-md'
                          : 'bg-[#f2f3ff]/60 text-[#161b2a] border-gray-200 hover:bg-[#eaedff]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        value="normal"
                        checked={formData.urgency === 'normal'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-caps text-label-caps ${
                            formData.urgency === 'normal'
                              ? 'bg-[#10B981] text-white'
                              : 'bg-[#10B981]/15 text-[#10B981]'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          NORMAL
                        </span>
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                      </div>
                      <span className="font-headline-sm text-base font-semibold mb-1">Routine</span>
                      <p className={`font-body-sm text-xs ${formData.urgency === 'normal' ? 'text-gray-300' : 'text-[#64748B]'}`}>
                        No immediate time pressure. Advance booking (48h+ notice).
                      </p>
                    </label>

                    {/* Soon */}
                    <label
                      className={`cursor-pointer relative flex flex-col p-4 rounded-2xl transition-all border ${
                        formData.urgency === 'soon'
                          ? 'bg-[#0A0F1D] text-white border-[#0A0F1D] shadow-md'
                          : 'bg-[#f2f3ff]/60 text-[#161b2a] border-gray-200 hover:bg-[#eaedff]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        value="soon"
                        checked={formData.urgency === 'soon'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-caps text-label-caps ${
                            formData.urgency === 'soon'
                              ? 'bg-[#F59E0B] text-white'
                              : 'bg-[#F59E0B]/15 text-[#F59E0B]'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          SOON
                        </span>
                        <span className="material-symbols-outlined text-[18px]">timelapse</span>
                      </div>
                      <span className="font-headline-sm text-base font-semibold mb-1">Upcoming</span>
                      <p className={`font-body-sm text-xs ${formData.urgency === 'soon' ? 'text-gray-300' : 'text-[#64748B]'}`}>
                        Support needed relatively soon (within next 12 to 24 hours).
                      </p>
                    </label>

                    {/* Urgent */}
                    <label
                      className={`cursor-pointer relative flex flex-col p-4 rounded-2xl transition-all border ${
                        formData.urgency === 'urgent'
                          ? 'bg-[#0A0F1D] text-white border-[#0A0F1D] shadow-md'
                          : 'bg-[#f2f3ff]/60 text-[#161b2a] border-gray-200 hover:bg-[#eaedff]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        value="urgent"
                        checked={formData.urgency === 'urgent'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-caps text-label-caps ${
                            formData.urgency === 'urgent'
                              ? 'bg-[#F43F5E] text-white'
                              : 'bg-[#F43F5E]/15 text-[#F43F5E]'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          URGENT
                        </span>
                        <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                      </div>
                      <span className="font-headline-sm text-base font-semibold mb-1">Prompt Action</span>
                      <p className={`font-body-sm text-xs ${formData.urgency === 'urgent' ? 'text-gray-300' : 'text-[#64748B]'}`}>
                        Important request requiring prompt attention today.
                      </p>
                    </label>
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-2xl bg-[#eaedff]/60 text-[#64748B] font-body-sm text-xs">
                    <span className="material-symbols-outlined text-[#F59E0B] text-[18px] shrink-0 mt-0.5">info</span>
                    <span>
                      Urgent classification notifies available community coordinators faster but does <strong className="text-[#0A0F1D]">not guarantee emergency medical response</strong>. For life-threatening emergencies, call 911 immediately.
                    </span>
                  </div>
                </section>

                <div className="w-full h-px bg-[#dee2f6]"></div>

                {/* CONSENT CHECKBOX */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#f2f3ff]/70 border border-gray-200">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={handleChange}
                      className="mt-1 w-5 h-5 rounded accent-[#006a6a] cursor-pointer shrink-0"
                    />
                    <label htmlFor="consent" className="font-body-default text-body-default text-[#161b2a] cursor-pointer">
                      I understand that CareConnect provides community support and does not replace professional or emergency medical services. All provided details will be reviewed according to civil privacy guidelines.
                    </label>
                  </div>
                  {errors.consent && <span className="text-xs text-[#F43F5E] font-medium">{errors.consent}</span>}
                </div>

                {/* AI Stream Simulation Progress Banner */}
                {isSubmitting && (
                  <div className="flex flex-col gap-2 p-4 rounded-2xl bg-[#006a6a]/10 border border-[#00d2d3]/30 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#006a6a]">
                        <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                        <span className="font-label-lg text-sm font-semibold">{statusMessage}</span>
                      </div>
                      <span className="font-label-caps text-label-caps text-[#006a6a] uppercase font-bold">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00d2d3] rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <p className="font-body-sm text-xs text-[#64748B]">
                      Gemini model extracting key-values &amp; matching qualified local volunteers...
                    </p>
                  </div>
                )}

                {/* ACTIONS ROW */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[#64748B] font-body-sm text-xs">
                    <span className="material-symbols-outlined text-[#10B981] text-[18px]">lock</span>
                    <span>256-bit Encrypted Healthcare Transit</span>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          category: '',
                          preferredDate: '',
                          preferredTime: '',
                          location: '',
                          description: '',
                          urgency: 'normal',
                          consent: false
                        })
                      }
                      className="w-1/2 sm:w-auto px-6 py-3.5 rounded-full font-label-lg text-sm text-[#64748B] hover:text-[#0A0F1D] hover:bg-gray-100 transition-all font-semibold"
                    >
                      Reset Form
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#0A0F1D] text-white font-label-lg text-sm shadow-[0_10px_25px_-5px_rgba(10,15,29,0.3)] hover:bg-[#006398] transition-all cursor-pointer group disabled:opacity-50 font-semibold"
                    >
                      <span>{isSubmitting ? 'Processing Intake...' : 'Submit Support Request'}</span>
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <span className="material-symbols-outlined text-[16px] text-white">arrow_forward</span>
                      </div>
                    </button>
                  </div>
                </div>

              </form>
            </div>

          </div>

          {/* Operational Stats Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xs border border-white flex flex-col gap-1">
              <span className="font-label-caps text-label-caps text-[#64748B] uppercase font-bold">Dispatched This Month</span>
              <span className="font-tabular-stat text-2xl text-[#0A0F1D] font-semibold">1,482</span>
              <span className="font-body-sm text-xs text-[#10B981] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> 98.4% Fulfilled
              </span>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xs border border-white flex flex-col gap-1">
              <span className="font-label-caps text-label-caps text-[#64748B] uppercase font-bold">Active Volunteers</span>
              <span className="font-tabular-stat text-2xl text-[#0A0F1D] font-semibold">430+</span>
              <span className="font-body-sm text-xs text-[#64748B]">Verified &amp; Background Checked</span>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xs border border-white flex flex-col gap-1">
              <span className="font-label-caps text-label-caps text-[#64748B] uppercase font-bold">Median Response</span>
              <span className="font-tabular-stat text-2xl text-[#0A0F1D] font-semibold">22 Min</span>
              <span className="font-body-sm text-xs text-[#10B981]">Within target SLA</span>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xs border border-white flex flex-col gap-1">
              <span className="font-label-caps text-label-caps text-[#64748B] uppercase font-bold">Service Rating</span>
              <span className="font-tabular-stat text-2xl text-[#0A0F1D] font-semibold">4.9 / 5.0</span>
              <span className="font-body-sm text-xs text-[#006a6a] flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined text-[16px] text-[#00d2d3]">star</span>
                ))}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
