import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Powered - Multimodal PDF Analyzer',
  description: 'AI-powered PDF analysis with support for text, tables, and diagrams using OpenAI GPT-4o',
  keywords: 'PDF, AI, RAG, multimodal, document analysis, GPT-4o',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
