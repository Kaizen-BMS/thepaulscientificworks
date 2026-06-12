'use client';

import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', subject: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email format';
    if (!formData.phone.trim()) e.phone = 'Phone is required';
    if (!formData.subject.trim()) e.subject = 'Subject is required';
    if (!formData.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    setApiError("");

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'contact-form' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || 'Failed to send message. Please try again.');
        return;
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
      setErrors({});

      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
  };

  const baseInput = "w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 rounded-lg focus:outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500";
  const normalBorder = "border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400";
  const errorBorder = "border-red-500 focus:border-red-600";

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Success */}
      {submitted && (
        <motion.div
          className="p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl flex items-center space-x-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div>
            <p className="font-bold text-green-600 dark:text-green-400">Message sent successfully!</p>
            <p className="text-sm text-green-600/80 dark:text-green-400/80">We'll get back to you within 24 hours.</p>
          </div>
        </motion.div>
      )}

      {/* API Error */}
      {apiError && (
        <motion.div
          className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-400 rounded-xl"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">{apiError}</p>
        </motion.div>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div custom={0} variants={inputVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe"
            className={`${baseInput} ${errors.name ? errorBorder : normalBorder}`} />
          {errors.name && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.name}</motion.p>}
        </motion.div>

        <motion.div custom={1} variants={inputVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com"
            className={`${baseInput} ${errors.email ? errorBorder : normalBorder}`} />
          {errors.email && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.email}</motion.p>}
        </motion.div>
      </div>

      {/* Phone + Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div custom={2} variants={inputVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number *</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91-9813356463"
            className={`${baseInput} ${errors.phone ? errorBorder : normalBorder}`} />
          {errors.phone && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.phone}</motion.p>}
        </motion.div>

        <motion.div custom={3} variants={inputVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Company/Institution</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Your Institution"
            className={`${baseInput} ${normalBorder}`} />
        </motion.div>
      </div>

      {/* Subject */}
      <motion.div custom={4} variants={inputVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Subject *</label>
        <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Product Inquiry"
          className={`${baseInput} ${errors.subject ? errorBorder : normalBorder}`} />
        {errors.subject && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.subject}</motion.p>}
      </motion.div>

      {/* Message */}
      <motion.div custom={5} variants={inputVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Message *</label>
        <textarea name="message" value={formData.message} onChange={handleChange}
          placeholder="Tell us about your requirements..." rows={6}
          className={`${baseInput} resize-none ${errors.message ? errorBorder : normalBorder}`} />
        {errors.message && <motion.p className="text-red-500 text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.message}</motion.p>}
      </motion.div>

      {/* Submit */}
      <motion.div custom={6} variants={inputVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="pt-4">
        <motion.button type="submit" disabled={loading}
          className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-slate-700 text-white font-bold rounded-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} />
              <span>Sending...</span>
            </>
          ) : (
            <><Send className="w-5 h-5" /><span>Send Message</span></>
          )}
        </motion.button>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 text-center">
          * Required fields. We'll respond within 24 hours.
        </p>
      </motion.div>
    </motion.form>
  );
}