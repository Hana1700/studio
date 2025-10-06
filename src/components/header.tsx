import Link from 'next/link';
import { AppLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { SearchBar } from './search-bar';
import { SidebarTrigger } from './ui/sidebar';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 md:flex items-center">
           <SidebarTrigger className="md:hidden mr-2" />
          <Link href="/" className="hidden md:flex items-center space-x-2">
            <AppLogo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold font-headline sm:inline-block">
              Annuaire
            </span>
          </Link>
        </div>

        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-md">
            <SearchBar />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <span className="hidden font-bold font-headline sm:inline-block">
            Annuaire téléphonique de......
          </span>
          <nav className="flex items-center">
            <Button variant="ghost" asChild>
              <Link href="/admin">Admin</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
