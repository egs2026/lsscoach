import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lean Six Sigma Master Coach™',
  description: 'Guided coaching app for DMAIC methodology and process improvement',
  keywords: 'lean six sigma, DMAIC, process improvement, project management, quality management',
  openGraph: {
    title: 'Lean Six Sigma Master Coach™ - Built with ChatAndBuild',
    description: 'Guided coaching app for DMAIC methodology and process improvement',
    images: ['https://cdn.chatandbuild.com/images/preview.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lean Six Sigma Master Coach™ - Built with ChatAndBuild',
    description: 'Guided coaching app for DMAIC methodology and process improvement',
    images: ['https://cdn.chatandbuild.com/images/preview.png'],
    site: '@chatandbuild',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Lean Six Sigma Master Coach™ - Built with ChatAndBuild" />
        <meta property="og:description" content="Guided coaching app for DMAIC methodology and process improvement" />
        <meta property="og:image" content="https://cdn.chatandbuild.com/images/preview.png" />
        <meta property="keywords" content="no-code, app builder, conversation-driven development, lean six sigma, DMAIC, Next.js, TypeScript, Supabase" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Lean Six Sigma Master Coach™ - Built with ChatAndBuild" />
        <meta property="twitter:description" content="Guided coaching app for DMAIC methodology and process improvement" />
        <meta property="twitter:image" content="https://cdn.chatandbuild.com/images/preview.png" />
        <meta property="twitter:site" content="@chatandbuild" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
