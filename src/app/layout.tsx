import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import JsonLd from "@/components/json-ld";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#3b82f6",
};

export const metadata: Metadata = {
  title: {
    default: "Jacob Barkin | Developer & Financial Education Advocate",
    template: "%s | Jacob Barkin"
  },
  description: "Jacob Barkin - Developer, financial education advocate, and technology enthusiast. Explore my projects, interests, and professional journey.",
  keywords: ["Jacob Barkin", "Developer", "Financial Education", "Web Development", "Next.js", "Portfolio", "Technology", "Accessibility", "Public Transportation Research"],
  authors: [{ name: "Jacob Barkin", url: "https://github.com/JSB2010" }],
  creator: "Jacob Barkin",
  publisher: "Jacob Barkin",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  metadataBase: new URL("https://jsb2010.github.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jacob Barkin | Developer & Financial Education Advocate",
    description: "Developer, financial education advocate, and technology enthusiast. Explore my projects, interests, and professional journey.",
    url: "https://jsb2010.github.io",
    siteName: "Jacob Barkin Portfolio",
    images: [
      {
        url: "/images/Updated logo.png",
        width: 800,
        height: 600,
        alt: "Jacob Barkin Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

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

  verification: {
    google: "verification_token",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/Updated logo.png" sizes="any" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/images/Updated logo.png" sizes="180x180" />
        {/* Theme color is added in metadata */}
      </head>
      <body className={`${inter.variable} antialiased min-h-screen bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
            <Footer />
          </div>
          <JsonLd />
        </ThemeProvider>
      </body>
    </html>
  );
}
