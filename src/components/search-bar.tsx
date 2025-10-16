'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, User, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import type { Contact, Structure } from '@/lib/types';

type Suggestion =
  | { type: 'contact'; data: Contact }
  | { type: 'structure'; data: Structure };

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 0) {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          // Assuming API returns mixed or contacts only. Let's process for suggestions.
          // For this simplified logic, we will assume it returns contacts and we can derive structures.
          // A more robust API would return suggestion types.
          const contactSuggestions = data
            .slice(0, 3)
            .map((c: Contact) => ({ type: 'contact' as const, data: c }));
          
          // This part is tricky without a dedicated structure search endpoint.
          // We will simulate it by filtering contacts' structures.
          const structureNames = new Set<string>();
          const structureSuggestions = data
            .map((c: Contact) => ({id: c.structureId, name: c.structureName}))
            .filter((s: {id: string, name: string | undefined}) => {
                if(s.name && s.name.toLowerCase().startsWith(query.toLowerCase()) && !structureNames.has(s.name)){
                    structureNames.add(s.name);
                    return true;
                }
                return false;
            })
            .slice(0, 2)
            .map((s: {id: string, name: string | undefined}) => ({ type: 'structure' as const, data: s as unknown as Structure }));

          setSuggestions([...contactSuggestions, ...structureSuggestions]);
          setShowSuggestions(true);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    
    const debounceTimer = setTimeout(() => {
        fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);

  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchContainerRef]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = () => {
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      <form onSubmit={handleSearch} className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          name="search"
          placeholder="Rechercher un contact ou une structure..."
          className="w-full pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
        />
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-md border bg-popover shadow-md z-50">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                {suggestion.type === 'contact' ? (
                   <Link
                    href={`/contact/${suggestion.data.id}`}
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent"
                    onClick={handleSuggestionClick}
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                        <p className="font-medium">{suggestion.data.name}</p>
                        <p className="text-xs text-muted-foreground">{suggestion.data.title}</p>
                    </div>
                  </Link>
                ) : (
                  <Link
                    href={`/structure/${suggestion.data.id}`}
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent"
                    onClick={handleSuggestionClick}
                  >
                     <Building className="h-4 w-4 text-muted-foreground" />
                     <p className="font-medium">{suggestion.data.name}</p>
                  </Link>
                )}
              </li>
            ))}
             <li className="border-t mt-1 pt-1">
                <Link href={`/search?q=${encodeURIComponent(query)}`} className="block px-4 py-2 text-sm font-medium text-center text-primary hover:bg-accent" onClick={handleSuggestionClick}>
                    Voir tous les résultats pour "{query}"
                </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
