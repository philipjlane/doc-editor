import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tiptap JSON Documentation Editor',
  description: 'A technical documentation editor with DITA-like JSON format',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
