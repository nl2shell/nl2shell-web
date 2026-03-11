import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  title: "NL2Shell — Stop using ChatGPT for shell commands",
  description:
    "Type what you want in plain English, get the shell command instantly. Powered by a fine-tuned 800M parameter model running locally. No API keys, no cloud, no subscription.",
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
    title: "NL2Shell — Stop using ChatGPT for shell commands",
    description:
      "Plain English to terminal commands — locally, instantly, privately. Free and open source.",
    type: "website",
    siteName: "NL2Shell",
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
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
