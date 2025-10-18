import { Suspense } from 'react';
import { SearchClient } from './search-client'; // Import the client component

// A simple loading state/fallback UI
const SearchLoading = () => (
  <div className="flex items-center justify-center h-48">
    Chargement des résultats...
  </div>
);

export default function SearchPage() {
  return (
    // Wrap the client component in Suspense
    <Suspense fallback={<SearchLoading />}>
      <SearchClient />
    </Suspense>
  );
}