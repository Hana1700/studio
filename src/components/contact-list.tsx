'use client';

import { useState } from 'react';
import type { Contact } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Phone,
  Smartphone,
  Search,
  Building,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import Link from 'next/link';

function ContactCard({ contact }: { contact: Contact }) {
  const contactLink = `/contact/${contact.id}`;

  return (
    <Link href={contactLink} className="block">
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarFallback>
              {contact.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="font-headline text-lg">{contact.name}</CardTitle>
            <CardDescription>{contact.title}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2 text-sm">
           <div className="flex items-center gap-2 text-muted-foreground pt-2 border-t">
                <Building className="h-4 w-4" />
                <span>{contact.structureName}</span>
            </div>
             {contact.subDepartmentName && (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{contact.subDepartmentName}</span>
                </div>
             )}
          
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            {contact.threeDigits && (
                <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                    <p className="text-xs text-muted-foreground">3 chiffres</p>
                    <p className="font-medium">{contact.threeDigits}</p>
                </div>
                </div>
            )}
            {contact.fourDigits && (
                <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                    <p className="text-xs text-muted-foreground">4 chiffres</p>
                    <p className="font-medium">{contact.fourDigits}</p>
                </div>
                </div>
            )}
            {contact.fourDigitsXX && (
                <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                    <p className="text-xs text-muted-foreground">4 chiffres MDN</p>
                    <p className="font-medium">{contact.fourDigitsXX}</p>
                </div>
                </div>
            )}
            {contact.fourDigitsYY && (
                <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                 <div>
                    <p className="text-xs text-muted-foreground">GSM</p>
                    <p className="font-medium">{contact.fourDigitsYY}</p>
                </div>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ContactList({ contacts }: { contacts: Contact[] }) {
  const [search, setSearch] = useState('');

  const filteredContacts =
    contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.title.toLowerCase().includes(search.toLowerCase()) ||
        contact.structureName?.toLowerCase().includes(search.toLowerCase()) ||
        contact.subDepartmentName?.toLowerCase().includes(search.toLowerCase())
    ) || [];

  if (contacts.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-24 text-center">
            <p className="text-muted-foreground">Aucun contact à afficher.</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Filtrer les contacts affichés..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm pl-9"
        />
      </div>

      {filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-24 text-center">
            <p className="text-muted-foreground">Aucun contact ne correspond à votre filtre.</p>
        </div>
      )}
    </div>
  );
}
