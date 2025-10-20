import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumb';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Smartphone, Building, Briefcase } from 'lucide-react';
import type { Contact } from '@/lib/types';
import { PrismaClient } from '@prisma/client';

// ----------------------------------------------------------------------
// FIX 1: Prevent multiple PrismaClient instances in development/hot-reloading
// ----------------------------------------------------------------------
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
// ----------------------------------------------------------------------

async function getContact(contactId: string): Promise<Contact | null> {
    const contact = await prisma.contact.findUnique({
        where: { id: contactId },
        include: {
            structure: true,
            subDepartment: true,
        }
    });

    if (!contact) return null;

    // Type assertion is required as Contact from '@/lib/types' is an extended type
    // that includes structureName and subDepartmentName.
    return {
        ...contact,
        structureName: contact.structure.name,
        subDepartmentName: contact.subDepartment?.name,
    } as Contact;
}

export default async function ContactPage({
  params,
}: {
  params: { contactId: string };
}) {
  const contact = await getContact(params.contactId);

  if (!contact) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Parcourir', href: '/browse' },
    {
      // The `!` is needed because TS can't infer it's not null/undefined even after `if (!contact) notFound()`
      label: contact.structureName!,
      href: `/structure/${contact.structureId}`,
    },
  ];

  if(contact.subDepartmentId && contact.subDepartmentName) {
    breadcrumbItems.push({
      label: contact.subDepartmentName,
      href: `/structure/${contact.structureId}/${contact.subDepartmentId}`,
    });
  }

  breadcrumbItems.push({
    label: contact.name,
    href: `/contact/${contact.id}`,
  });


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
        {/*
          FIX 2: Refactor CardContent to display each digit attribute in a separate "column" (card)
          The grid-cols-2 is maintained, but now displays all relevant details.
        */}
        <CardContent className="mt-6 grid gap-4 md:grid-cols-2">

          {/* New Card for threeDigits */}
          {contact.threeDigits && (
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Phone className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">3 chiffres</p>
                <p className="font-medium">{contact.threeDigits}</p>
              </div>
            </div>
          )}

          {/* New Card for fourDigits */}
          {contact.threeDigits && (
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Phone className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">4 chiffres interne</p>
                <p className="font-medium">{contact.fourDigits}</p>
              </div>
            </div>
          )}

          {/* New Card for fourDigitsXX */}
          {contact.fourDigitsXX && (
             <div className="flex items-center gap-4 rounded-lg border p-4">
              <Phone className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">4 chiffres MDN</p>
                <p className="font-medium">{contact.fourDigitsXX}</p>
              </div>
            </div>
          )}
          
          {/* New Card for fourDigitsYY (Secondary/Mobile) */}
          {contact.fourDigitsYY && (
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Smartphone className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">GSM (4/10 chiffres)</p>
                <p className="font-medium">{contact.fourDigitsYY}</p>
              </div>
            </div>
          )}

           {/* Structure Card */}
           <div className="flex items-center gap-4 rounded-lg border p-4">
            <Building className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Structure</p>
              <p className="font-medium">{contact.structureName}</p>
            </div>
          </div>

          {/* Sub-department Card */}
          {contact.subDepartmentName && (
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Briefcase className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Sous-direction</p>
                <p className="font-medium">{contact.subDepartmentName}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
