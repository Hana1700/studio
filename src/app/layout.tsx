import type { Metadata } from 'next';
import { AppHeader } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AuthProvider } from '@/hooks/use-auth.tsx';

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
        <AuthProvider>
          <SidebarProvider>
              <Sidebar side="left">
                <SidebarContent>
                  <AppSidebar />
                </SidebarContent>
              </Sidebar>
              <div className="flex flex-col flex-1">
                <AppHeader />
                <main className="flex flex-1 justify-center py-8">
                  <div className="container w-full">
                    {children}
                  </div>
                </main>
              </div>
          </SidebarProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
