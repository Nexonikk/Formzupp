import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { dark } from "@clerk/themes";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Formzupp | AI Form Builder",
  description:
    "Create, customize, and share powerful AI-powered forms. Formzupp is where smart forms begin.",
  keywords: [
    "form builder",
    "AI form builder",
    "AI custom forms",
    "Conversational AI forms",
    "survey tool",
    "smart forms",
    "Formzupp",
    "custom forms",
  ],
  metadataBase: new URL("https://formzupp.vercel.app"),
  openGraph: {
    title: "Formzupp | AI Form Builder",
    description:
      "Build and experience the power of AI forms. Modern Ui, Conversational interface, and AI prompt gnenerated forms with Formzupp.",
    url: "https://formzupp.vercel.app",
    siteName: "Formzupp",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "Formzupp Preview",
      },
    ],
    type: "website",
  },
  icons: {
    icon: "/formzupp.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
