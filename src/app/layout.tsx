import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kenilworth Home',
  description: 'Home management',
  robots: { index: false, follow: false },
  manifest: '/manifest.json',
  // Launch as a standalone web app from the iOS home screen.
  appleWebApp: {
    capable: true,
    title: 'Home',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#1A1816',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
