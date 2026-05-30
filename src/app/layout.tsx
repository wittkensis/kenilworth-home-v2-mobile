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
    <html lang="en" style={{ height: '100%' }}>
      <head>
        {/* Apply saved theme before first paint — prevents flash of default theme */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('home-theme');if(t&&t!=='folk')document.documentElement.dataset.theme=t;}catch(e){}` }} />
      </head>
      <body style={{ height: '100%' }}>{children}</body>
    </html>
  );
}
