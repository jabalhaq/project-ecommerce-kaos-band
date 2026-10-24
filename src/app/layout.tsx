import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Vinyl Crate | Band Merch & Music Merchandise',
  description:
    'Curated band merch for the analog soul. Authentic vintage-styled merchandise from your favourite bands — metal, punk, grunge, and classic rock.',
  keywords: ['band merch', 'music merchandise', 'vinyl', 'rock', 'punk', 'metal', 'grunge'],
  openGraph: {
    title: 'The Vinyl Crate | Band Merch & Music Merchandise',
    description: 'Curated band merch for the analog soul.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/* Midtrans Snap */}
        <script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ''}
          async
        />
      </head>
      <body
        className={`${inter.className} bg-[#121212] text-[#F4EBD9] min-h-screen flex flex-col antialiased`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
