// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import Header from '@/components/Header'; // Import Header
import Footer from '@/components/Footer'; // Import Footer

// We can import a font here later if we want

export const metadata: Metadata = {
  title: 'Meiden',
  description: 'Official Website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white">
        <Providers>
          <Header />
          {/* Add padding to the top of main to offset the fixed header */}
          <main className="pt-16"> 
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}