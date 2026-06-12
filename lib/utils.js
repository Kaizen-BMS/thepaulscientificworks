// lib/utils.js
import slugify from "slugify";

export function createSlug(text) {
  return slugify(text, { lower: true, strict: true, trim: true });
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatPrice(price) {
  if (!price) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function truncate(str, n) {
  return str && str.length > n ? str.slice(0, n - 1) + "…" : str;
}

export function getWhatsAppLink(phone, message) {
  const encodedMessage = encodeURIComponent(message || "Hello, I am interested in your products.");
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

export function buildWhatsAppMessage(product) {
  return `Hello Paul Scientific Works,\n\nI am interested in:\n*${product.name}*\nProduct Code: ${product.productCode}\n\nPlease share pricing and availability.\n\nThank you.`;
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}