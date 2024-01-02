import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import ThemeProvider from '@/providers/ThemeProvider';
import RootStyleRegistry from '@/providers/RootStyleRegistry';
import LayoutProvider from '@/providers/LayoutProvider';
import StoreProvider from '@/providers/StoreProvider';
import './globals.css';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500']
});

export const metadata: Metadata = {
  title: 'SOZAI.',
  description: 'E-commerce site built with Next.js and Typescript.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link
          href='https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css'
          rel='stylesheet'
        ></link>
      </head>
      <body className={openSans.className} suppressHydrationWarning={true}>
        <StoreProvider>
          <RootStyleRegistry>
            <ThemeProvider>
              <LayoutProvider>{children}</LayoutProvider>
            </ThemeProvider>
          </RootStyleRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
