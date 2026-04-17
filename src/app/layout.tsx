/**
 * © 2026 Project of HOUSSEM ABDALLAH MERAMRIA
 * MeraLaw - Algerian Legal Platform
 * Developed by Prof. HOUSSEM ABDALLAH MERAMRIA
 */

import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import './globals.css';
import { Providers, NavbarWrapper, FooterWrapper } from '@/components/Providers';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MeraLaw | Developed by Prof. MERAMRIA',
  description: 'MeraLaw - Plateforme juridique algérienne complète pour les professionnels du droit.',
  authors: [{ name: 'Prof. HOUSSEM ABDALLAH MERAMRIA' }],
  creator: 'Prof. HOUSSEM ABDALLAH MERAMRIA',
  keywords: ['legal', 'law', 'Algeria', 'JORF', 'laws', 'juridique', 'Algérie'],
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-inter">
        <Providers>
          <NavbarWrapper />
          <main className="flex-1">{children}</main>
          <FooterWrapper />
        </Providers>
      </body>
    </html>
  );
}