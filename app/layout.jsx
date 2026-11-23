import './fonts.css';
import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'http://localhost:3000'),
  applicationName: 'AJKER খবর KI?',
  icons: { apple: '/icons/apple-touch-icon.png' },
  appleWebApp: { capable: true, title: 'Ajker Khobor', statusBarStyle: 'default' },
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#D21F14' };

// Runs before the page paints, so dark-mode users never see a white flash.
const themeScript = "try{var t=localStorage.getItem('akk-theme');if(t!=='dark'&&t!=='light')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.akk=t}catch(e){}";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* The font is served from this site (app/fonts.css). Every page shows Latin and Bangla letters, so fetch both files early. */}
        <link rel="preload" href="/fonts/anek-bangla-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/anek-bangla-bengali.woff2" as="font" type="font/woff2" crossOrigin="" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
