import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Paul Scientific Works — Scientific & Laboratory Equipment",
  description:
    "ISO 9001:2015 Certified Manufacturer and Exporter of Scientific, Laboratory and Medical Instruments. Serving institutions since 1989.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QHN4M5TY0G"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QHN4M5TY0G');
          `}
        </Script>

        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
