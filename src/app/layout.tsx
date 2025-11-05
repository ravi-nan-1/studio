import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Free Online PDF to Word & Word to PDF Converter | Instant & Secure',
  description:
    'Convert PDF to Word or Word to PDF instantly for free. No sign-up, no watermark — fast, secure, and accurate conversion preserving original formatting.',
  keywords:
    'pdf to word, word to pdf, free pdf converter, online pdf to word tool, convert pdf to docx, docx to pdf online, free pdf conversion, pdf to word converter no sign up, best pdf to word tool, convert scanned pdf, ocr pdf to word, convert large pdf to word, fast pdf converter, pdf editor, edit pdf in word',
  robots: 'index, follow',
  openGraph: {
    title: 'Free PDF ↔ Word Converter | Convert Instantly Online',
    description:
      'Free online tool to convert PDF to Word and Word to PDF without losing formatting. Fast, secure, and watermark-free.',
    images: [
      {
        url: 'https://yourwebsite.com/images/pdf-converter-preview.png',
        width: 1200,
        height: 630,
        alt: 'FileFlipper PDF and Word Converter',
      },
    ],
    url: 'https://yourwebsite.com/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free PDF ↔ Word Converter | Convert Instantly Online',
    description:
      'Convert PDF to Word or Word to PDF instantly — free, no login, and secure.',
    images: ['https://yourwebsite.com/images/pdf-converter-preview.png'],
  },
  metadataBase: new URL('https://yourwebsite.com'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
