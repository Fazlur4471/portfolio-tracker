import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Portfolio Analytics | Smart Finance Tracker',
  description: 'Track your Indian and Global stock portfolios with AI-powered analysis, financial planning tools, and daily finance lessons.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
