import type { Metadata } from 'next';
import { AppHeader } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export const metadata: Metadata = {
  title: 'Annuaire téléphonique de......',
  description: 'Centralisez et organisez les coordonnées téléphoniques de l’entreprise.',
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <SidebarProvider>
          <div className="relative flex min-h-screen flex-col">
            <AppHeader />
            <div className="flex flex-1">
              <Sidebar side="left" collapsible="offcanvas">
                <SidebarContent>
                  <AppSidebar />
                </SidebarContent>
              </Sidebar>
              <main className="flex-1 container py-8">{children}</main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
