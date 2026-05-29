import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "CampusCompass | Find Your Perfect College",
    template: "%s | CampusCompass",
  },
  description: "Navigate the complex world of higher education with data-driven insights. Compare top Indian universities, track placements, and secure your future with CampusCompass.",
  keywords: ["college discovery", "IIT", "NIT", "IIIT", "compare colleges", "placements", "engineering colleges India", "campus compass", "college finder"],
  metadataBase: new URL("https://campuscompass.onrender.com"),
  openGraph: {
    title: "CampusCompass | Find Your Perfect College",
    description: "Data-driven college discovery platform. Compare IITs, NITs, and top universities side-by-side.",
    siteName: "CampusCompass",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusCompass | Find Your Perfect College",
    description: "Compare top Indian colleges with data-driven insights. Explore placements, fees, and rankings.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface-container-lowest text-on-surface antialiased">
        <Providers>
          <Navbar />
          <main className="pt-20 min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
