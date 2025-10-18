import { AppLogo } from '@/components/icons';
import { SearchBar } from '@/components/search-bar';

export default function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-8 text-center -mt-16">
      <div className="flex items-center space-x-4">
        <AppLogo className="h-20 w-20 text-primary" />
        <h1 className="font-headline text-5xl font-bold tracking-tight">
          Annuaire
        </h1>
      </div>
      <p className="max-w-xl text-lg text-muted-foreground">
        Recherchez rapidement des contacts, des services ou des structures
      </p>
      <div className="w-full max-w-2xl px-4">
        <SearchBar />
      </div>
    </div>
  );
}
