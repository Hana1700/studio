'use client';

import Link from 'next/link';
import { AppLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { SearchBar } from './search-bar';
import { Home } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <AppLogo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold font-headline sm:inline-block">
              Annuaire
            </span>
          </Link>
        </div>

        <div className="flex flex-1 justify-center px-4">
          <div className="w-full max-w-md">
            <SearchBar />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
           <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Accueil
              </Link>
            </Button>
          <nav className="flex items-center">
            <Button variant="ghost" asChild>
              <Link href="/login">Admin</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
