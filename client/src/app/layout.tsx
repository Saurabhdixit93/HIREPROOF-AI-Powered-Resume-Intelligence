import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hireproof.ai"),
  title: {
    default: "HIREPROOF | AI-Powered Resume Intelligence",
    template: "%s | HIREPROOF",
  },
  description:
    "Build bulletproof, ATS-optimized resumes with multi-model AI. Craft your professional identity with surgical precision and secure your dream role.",
  keywords: [
    "AI Resume Builder",
    "ATS Optimization",
    "Cover Letter AI",
    "Career Intelligence",
    "Professional Resume",
    "Hireproof",
  ],
  authors: [{ name: "Saurabh Dixit" }],
  creator: "Saurabh Dixit",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hireproof.ai",
    title: "HIREPROOF | AI-Powered Resume Intelligence",
    description:
      "Build bulletproof, ATS-optimized resumes with multi-model AI.",
    siteName: "HIREPROOF",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HIREPROOF - AI-Powered Resume Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HIREPROOF | AI-Powered Resume Intelligence",
    description:
      "Build bulletproof, ATS-optimized resumes with multi-model AI.",
    images: ["/og-image.png"],
    creator: "@hireproof",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-[#fafafa] text-[#1a1a1a]`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "HIREPROOF",
              operatingSystem: "Web",
              applicationCategory: "BusinessApplication",
              description:
                "AI-Powered Resume Intelligence and ATS-optimized resume builder.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Person",
                name: "Saurabh Dixit",
              },
            }),
          }}
        />
        <AuthProvider>
          <QueryProvider>
            <SocketProvider>
              {children}
              <Toaster position="bottom-right" />
            </SocketProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
