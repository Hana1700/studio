'use client';

import { useState } from 'react';
import type { Contact } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Phone,
  Smartphone,
  User,
  Briefcase,
  Mail,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

function ContactCard({ contact }: { contact: Contact }) {
  return (
    <Card>
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
          <p className="text-sm text-muted-foreground">{contact.title}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <a href={`tel:${contact.phone}`} className="hover:text-primary">
            {contact.phone}
          </a>
        </div>
        {contact.mobile && (
          <div className="flex items-center gap-3">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <a href={`tel:${contact.mobile}`} className="hover:text-primary">
              {contact.mobile}
            </a>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a href={`mailto:${contact.email}`} className="hover:text-primary">
            {contact.email}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export function ContactList({ contacts }: { contacts: Contact[] }) {
  const [search, setSearch] = useState('');

  const filteredContacts =
    contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.title.toLowerCase().includes(search.toLowerCase()) ||
        contact.phone.includes(search) ||
        contact.mobile?.includes(search)
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
          placeholder="Filtrer par nom, poste, numéro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm pl-9"
        />
      </div>

      {filteredContacts.length > 0 ? (
        <>
          {/* Mobile View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>

          {/* Desktop View */}
          <Card className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Poste / Fonction</TableHead>
                  <TableHead>Téléphone Fixe</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.title}</TableCell>
                    <TableCell>
                      <a href={`tel:${contact.phone}`} className="hover:text-primary">{contact.phone}</a>
                    </TableCell>
                    <TableCell>
                      {contact.mobile ? <a href={`tel:${contact.mobile}`} className="hover:text-primary">{contact.mobile}</a> : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>
                       <a href={`mailto:${contact.email}`} className="hover:text-primary">{contact.email}</a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-24 text-center">
            <p className="text-muted-foreground">Aucun contact ne correspond à votre recherche.</p>
        </div>
      )}
    </div>
  );
}
