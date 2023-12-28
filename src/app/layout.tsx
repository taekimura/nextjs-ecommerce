import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SOZAI',
  description: 'E-commerce site built with Next.js and Typescript.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
