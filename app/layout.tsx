
// ============================================
// FILE: app/layout.tsx
// ============================================

import './globals.css';
import type { Metadata } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import { UserProvider }    from '@/context/UserContext';
import { BalanceProvider } from '@/context/BalanceContext';

const dmSans = DM_Sans({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display:  'swap',
});

const syne = Syne({
  subsets:  ['latin'],
  weight:   ['700', '800'],
  variable: '--font-syne',
  display:  'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ),
  title:       'Solana Investment Tracker',
  description: 'Track your Solana investments and portfolio performance',
  openGraph: {
    title:       'Solana Investment Tracker',
    description: 'Track your Solana investments and portfolio performance',
    type:        'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Solana Investment Tracker',
    description: 'Track your Solana investments and portfolio performance',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <body className={dmSans.className}>
        <UserProvider>
          <BalanceProvider>
            {children}
          </BalanceProvider>
        </UserProvider>
      </body>
    </html>
  );
}
