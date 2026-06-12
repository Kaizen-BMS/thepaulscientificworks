"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname() || "";

  const isIsolated =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/superadmin");

  if (isIsolated) return <>{children}</>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
}