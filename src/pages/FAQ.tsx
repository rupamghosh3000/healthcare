import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { FAQItem } from '../types';

export const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-5']);

  useEffect(() => {
    api.getFAQs()
      .then((res) => setFaqs(res.faqs))
      .catch((err) => console.error('Failed to load FAQs:', err));
  }, []);

  const categories = ['All', 'General', 'Volunteering', 'Transportation', 'Process', 'Emergency & Safety'];

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="relative w-full overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-[#00d2d3]/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-[1040px] mx-auto px-5 md:px-10 pt-28 md:pt-36 pb-20">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eaedff] text-[#006a6a] font-label-caps text-xs uppercase font-bold tracking-wider">
              <span className="material-symbols-outlined text-[16px]">help_center</span>
              Knowledge Base &amp; Support
            </div>
            <h1 className="font-display-hero text-headline-lg md:text-display-hero text-[#0A0F1D] tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="font-body-lead text-base md:text-lg text-[#64748B]">
              Everything you need to know about requesting assistance, volunteering, our non-emergency protocol, and AI intake organization.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto mb-8">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[22px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keywords (e.g. ride, hospital, emergency)..."
              className="w-full h-14 pl-12 pr-4 rounded-full bg-white/90 shadow-sm border border-gray-200 text-[#0A0F1D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d2d3] text-sm"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full font-label-lg text-sm transition-all border ${
                  activeCategory === cat
                    ? 'bg-[#0A0F1D] text-white border-[#0A0F1D] shadow-sm'
                    : 'bg-white/80 text-[#64748B] border-gray-200 hover:bg-[#dee2f6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQs List */}
          <div className="flex flex-col gap-4">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white/80 rounded-3xl p-10 text-center text-[#64748B] border border-gray-100">
                <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">find_in_page</span>
                <p className="font-headline-sm text-base font-semibold text-[#0A0F1D]">No answers found</p>
                <p className="text-sm mt-1">Try another search term or ask our real-time AI Assistant directly.</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openIds.includes(faq.id);
                return (
                  <div
                    key={faq.id}
                    className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-xs overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleAccordion(faq.id)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-[#f2f3ff]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#00d2d3]"></span>
                        <span className="font-headline-sm text-base font-semibold text-[#0A0F1D]">
                          {faq.question}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-gray-400 text-[20px] shrink-0 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-[#64748B] font-body-default text-sm leading-relaxed border-t border-gray-100/60 animate-in fade-in duration-150">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Ask AI Banner */}
          <div className="mt-12 bg-gradient-to-r from-[#006a6a] to-[#006398] rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[32px] text-[#56f9f9]">auto_awesome</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-lg font-bold">Have a specific or unlisted question?</h3>
                <p className="text-sm text-white/80 mt-0.5">
                  Our Gemini-backed AI Assistant can answer operational and non-emergency protocol questions instantly.
                </p>
              </div>
            </div>
            <Link
              to="/ai-assistant"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#0A0F1D] font-label-lg text-sm rounded-full shadow hover:bg-[#56f9f9] transition-all font-semibold"
            >
              <span>Ask CareConnect AI</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
