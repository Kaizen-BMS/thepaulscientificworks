import "./globals.css";
import { Inter } from "next/font/google";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Paul Scientific Works — Scientific & Laboratory Equipment",
  description: "ISO 9001:2015 Certified Manufacturer and Exporter of Scientific, Laboratory and Medical Instruments. Serving institutions since 1989.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}