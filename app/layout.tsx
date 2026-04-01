import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nl2shell.com"),
  title: "NL2Shell — Natural Language to Shell Commands",
  description:
    "Type what you want in plain English, get the shell command instantly. Powered by a fine-tuned 800M model. No API keys, no cloud, no subscription. Privacy-first.",
  keywords: [
    "nl2shell",
    "natural language to shell",
    "shell command generator",
    "AI terminal assistant",
    "local AI",
    "command line AI",
  ],
  authors: [{ name: "Arya Teja" }],
  openGraph: {
    title: "NL2Shell — Natural Language to Shell Commands",
    description:
      "Plain English to terminal commands — locally, instantly, privately. Free and open source.",
    type: "website",
    siteName: "NL2Shell",
    url: "https://nl2shell.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "NL2Shell — Stop using ChatGPT for shell commands",
    description:
      "Plain English to terminal commands — locally, instantly, privately.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
