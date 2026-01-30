
// ============================================
// FILE: app/layout.tsx
// ============================================
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
    'http://localhost:3000'
  ),
  title: 'Solana Investment Tracker',
  description: 'Track your Solana investments and portfolio performance',
  openGraph: {
    title: 'Solana Investment Tracker',
    description: 'Track your Solana investments and portfolio performance',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solana Investment Tracker',
    description: 'Track your Solana investments and portfolio performance',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}