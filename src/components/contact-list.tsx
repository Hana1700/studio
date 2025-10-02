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
  Building,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import Link from 'next/link';

function ContactCard({ contact }: { contact: Contact & { structureId?: string; subDepartmentId?: string; subDepartmentName?: string } }) {
  const contactLink = `/contact/${contact.id}`;

  return (
    <Link href={contactLink} className="block">
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
        <CardContent className="grid grid-cols-2 gap-4 pt-4 text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{contact.phone}</span>
          </div>
          {contact.mobile && (
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{contact.mobile}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function ContactList({ contacts }: { contacts: (Contact & { structureId?: string, subDepartmentId?: string, subDepartmentName?: string })[] }) {
  const [search, setSearch] = useState('');

  const filteredContacts =
    contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.title.toLowerCase().includes(search.toLowerCase()) ||
        contact.phone.includes(search) ||
        contact.mobile?.includes(search) ||
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
          placeholder="Filtrer par service, nom, poste..."
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
                  <TableHead>Service</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Numéro 1</TableHead>
                  <TableHead>Numéro 2</TableHead>
                  <TableHead>Numéro 3</TableHead>
                  <TableHead>Numéro 4</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => {
                  const contactLink = `/contact/${contact.id}`;
                  
                  const CellComponent = Link;
                  const cellProps = { href: contactLink };

                  return (
                    <TableRow key={contact.id} className={'cursor-pointer'}>
                       <TableCell>
                        <CellComponent {...cellProps} className="block hover:text-primary">{contact.subDepartmentName}</CellComponent>
                      </TableCell>
                      <TableCell className="font-medium">
                        <CellComponent {...cellProps} className="block hover:text-primary">
                          <div>{contact.name}</div>
                          <div className="text-sm text-muted-foreground">{contact.title}</div>
                        </CellComponent>
                      </TableCell>
                      <TableCell>
                        <CellComponent {...cellProps} className="block hover:text-primary">{contact.phone}</CellComponent>
                      </TableCell>
                      <TableCell>
                        {contact.mobile ? <CellComponent {...cellProps} className="block hover:text-primary">{contact.mobile}</CellComponent> : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell><span className="text-muted-foreground">-</span></TableCell>
                      <TableCell><span className="text-muted-foreground">-</span></TableCell>
                    </TableRow>
                  );
                })}
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
