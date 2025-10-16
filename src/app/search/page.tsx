'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ContactList } from '@/components/contact-list';
import type { Contact } from '@/lib/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (query) {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setFilteredContacts(data);
        }
      } else {
        setFilteredContacts([]);
      }
    };
    fetchContacts();
  }, [query]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Résultats de la recherche
        </h1>
        {query ? (
          <p className="mt-1 text-muted-foreground">
            {filteredContacts.length} résultat(s) pour "{query}"
          </p>
        ) : (
            <p className="mt-1 text-muted-foreground">
                Veuillez entrer un terme de recherche.
            </p>
        )}
      </div>

      {query ? (
        <ContactList contacts={filteredContacts} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-24 text-center">
            <p className="text-muted-foreground">Utilisez la barre de recherche en haut pour trouver un contact.</p>
        </div>
      )}
    </div>
  );
}
