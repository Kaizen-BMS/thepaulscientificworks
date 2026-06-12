"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const FALLBACK = [
  { id: "f1", quote: "Reliable supplier with professional customer support and durable scientific products.", authorName: "Science Department", organization: "Educational Institution", rating: 5 },
  { id: "f2", quote: "Our nursing lab setup was completed smoothly with quality equipment and fast service.", authorName: "Procurement Head", organization: "Nursing College", rating: 5 },
  { id: "f3", quote: "Trusted manufacturer for educational and scientific laboratory solutions.", authorName: "Director", organization: "Government Institution", rating: 5 },
];

export default function HomeTestimonials() {
  const [testimonials, setTestimonials] = useState(FALLBACK);
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials?showOnHome=true&limit=10")
      .then(r => r.json())
      .then(d => { if (d.data?.length > 0) setTestimonials(d.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % testimonials.length), 4500);
    return () => clearInterval(t);
  }, [testimonials, auto]);

  const prev = () => { setAuto(false); setCurrent(c => (c - 1 + testimonials.length) % testimonials.length); };
  const next = () => { setAuto(false); setCurrent(c => (c + 1) % testimonials.length); };
  const t = testimonials[current] || FALLBACK[0];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-400 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-indigo-400 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold text-blue-300 uppercase tracking-widest">Client Feedback</span>
          <h2 className="text-4xl font-extrabold mt-2 mb-3">What Our Clients Say</h2>
          <p className="text-blue-200 text-sm">Trusted by schools, colleges, hospitals and research institutions across India.</p>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id || current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-10 text-center"
            >
              <Quote className="w-10 h-10 text-blue-400/40 mx-auto mb-6" />
              <div className="flex justify-center gap-1 mb-5">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400" style={{ width: 18, height: 18, fill: "currentColor" }} />
                ))}
              </div>
              <p className="text-lg md:text-xl text-white leading-relaxed mb-8 italic font-light max-w-2xl mx-auto">
                "{t.quote}"
              </p>
              <div>
                <p className="font-bold text-white text-base">{t.authorName}</p>
                {t.authorRole && <p className="text-blue-300 text-sm">{t.authorRole}</p>}
                {t.organization && <p className="text-blue-300 text-sm mt-0.5">{t.organization}</p>}
              </div>
            </motion.div>
          </AnimatePresence>

          {testimonials.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors border border-white/20 hidden md:flex">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors border border-white/20 hidden md:flex">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        <div className="flex justify-center gap-2 mt-7">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => { setAuto(false); setCurrent(i); }}
              className={`h-2 rounded-full transition-all ${i === current ? "bg-white w-6" : "bg-white/30 w-2"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}