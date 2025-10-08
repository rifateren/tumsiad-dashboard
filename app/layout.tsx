import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TÜMSİAD Denizli - Stratejik Yönetim Platformu",
  description: "TÜMSİAD Denizli şubesi için stratejik analiz ve yönetim dashboard'u",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="tumsiad-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
