import { notFound } from 'next/navigation';
import { allContacts } from '@/lib/data';
import { Breadcrumbs } from '@/components/breadcrumb';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Smartphone, Mail, Building, Briefcase } from 'lucide-react';

export async function generateStaticParams() {
  return allContacts.map((contact) => ({
    contactId: contact.id,
  }));
}

export default function ContactPage({
  params,
}: {
  params: { contactId: string };
}) {
  const contact = allContacts.find((c) => c.id === params.contactId);

  if (!contact) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    {
      label: contact.structureName!,
      href: `/structure/${contact.structureId}`,
    },
    {
      label: contact.subDepartmentName!,
      href: `/structure/${contact.structureId}/${contact.subDepartmentId}`,
    },
    {
      label: contact.name,
      href: `/contact/${contact.id}`,
    },
  ];

  return (
    <div className="space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      <Card>
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarFallback className="text-4xl">
              {contact.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="font-headline text-3xl">{contact.name}</CardTitle>
          <CardDescription className="text-lg">{contact.title}</CardDescription>
        </CardHeader>
        <CardContent className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <Phone className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Numéro 1</p>
              <p className="font-medium">{contact.phone}</p>
            </div>
          </div>
          {contact.mobile && (
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Smartphone className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Numéro 2</p>
                <p className="font-medium">{contact.mobile}</p>
              </div>
            </div>
          )}
           <div className="flex items-center gap-4 rounded-lg border p-4">
            <Building className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Structure</p>
              <p className="font-medium">{contact.structureName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <Briefcase className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Sous-direction</p>
              <p className="font-medium">{contact.subDepartmentName}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
