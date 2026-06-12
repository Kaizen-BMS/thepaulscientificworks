'use client';

import { motion } from 'framer-motion';

const milestones = [
  {
    year: '1989',
    title: 'Company Founded',
    description: 'Paul Scientific Works established in Ambala Cantt by Mr. Harpal Sagar.',
  },
  {
    year: '1995',
    title: 'Product Expansion',
    description: 'Expanded into medical and nursing equipment for healthcare institutions.',
  },
  {
    year: '2002',
    title: 'Government Contracts',
    description: 'Began supplying to government schools and colleges across Haryana.',
  },
  {
    year: '2010',
    title: 'ISO Certification',
    description: 'Achieved ISO 9001 certification, affirming quality management standards.',
  },
  {
    year: '2015',
    title: 'National Reach',
    description: 'Expanded operations to serve institutions across 20+ Indian states.',
  },
  {
    year: '2020',
    title: 'Digital Presence',
    description: 'Launched online catalogue and expanded international export capabilities.',
  },
  {
    year: '2024',
    title: '36 Years Strong',
    description: 'Serving 1000+ institutions with 5000+ quality scientific products.',
  },
];

export default function Timeline() {
  return (
    <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-1.5">
            Our Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            36 Years of Excellence
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
            A legacy of quality, innovation and service to India's educational and healthcare institutions.
          </p>
        </motion.div>

        {/* Horizontal Timeline — desktop */}
        <div className="hidden md:block relative">
          {/* Connector line */}
          <div className="absolute top-[28px] left-0 right-0 h-0.5 bg-gradient-to-r from-slate-200 via-blue-400 to-slate-200 dark:from-slate-800 dark:via-blue-600 dark:to-slate-800 z-0" />

          <div className="relative z-10 grid grid-cols-7 gap-2">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                {/* Dot */}
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mb-2 z-10 shadow-sm
                  ${i === milestones.length - 1
                    ? "bg-blue-600 border-blue-600 ring-4 ring-blue-100 dark:ring-blue-900"
                    : "bg-white dark:bg-slate-900 border-blue-500"
                  }`}
                />

                {/* Year */}
                <span className="text-[12px] font-extrabold text-blue-700 dark:text-blue-400 mb-1.5 tabular-nums">
                  {m.year}
                </span>

                {/* Card */}
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 w-full">
                  <p className="text-[11.5px] font-bold text-slate-800 dark:text-white mb-1 leading-tight">
                    {m.title}
                  </p>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vertical Timeline — mobile */}
        <div className="md:hidden relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-slate-200 dark:from-blue-600 dark:to-slate-700" />

          <div className="space-y-5">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                viewport={{ once: true }}
                className="relative flex gap-4"
              >
                {/* Dot */}
                <div className={`absolute -left-5 top-1 w-3.5 h-3.5 rounded-full border-2 z-10 flex-shrink-0
                  ${i === milestones.length - 1
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white dark:bg-slate-900 border-blue-500"
                  }`}
                />

                {/* Content */}
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 w-full">
                  <span className="text-[11px] font-extrabold text-blue-700 dark:text-blue-400 tabular-nums block mb-1">
                    {m.year}
                  </span>
                  <p className="text-[12.5px] font-bold text-slate-800 dark:text-white mb-0.5">{m.title}</p>
                  <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">{m.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}