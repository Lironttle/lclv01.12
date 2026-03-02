import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { MainLayout } from '@/components/layout/main-layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'LCL Portal - Business Command Center',
  description:
    'Internal business command center for LCL Automation. Manage leads, tasks, pipeline, outreach, and analytics.',
  icons: {
    icon: '/lcl-logo.png',
    apple: '/lcl-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
