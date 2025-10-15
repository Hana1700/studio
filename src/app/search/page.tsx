'use client';

import { useSearchParams } from 'next/navigation';
import { allContacts } from '@/lib/data';
import { ContactList } from '@/components/contact-list';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const filteredContacts = query
    ? allContacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(query.toLowerCase()) ||
          contact.title.toLowerCase().includes(query.toLowerCase()) ||
          contact.phone.includes(query) ||
          contact.mobile?.includes(query) ||
          contact.structureName.toLowerCase().includes(query.toLowerCase()) ||
          contact.subDepartmentName?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

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
