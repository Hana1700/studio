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

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


async function getContact(contactId: string): Promise<Contact | null> {
    const contact = await prisma.contact.findUnique({
        where: { id: contactId },
        include: {
            structure: true,
            subDepartment: true,
        }
    });

    if (!contact) return null;

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
    { label: 'Accueil', href: '/' },
    {
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
        <CardContent className="mt-6 grid gap-4 md:grid-cols-2">

          {contact.threeDigits && (
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Phone className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">3 chiffres</p>
                <p className="font-medium">{contact.threeDigits}</p>
              </div>
            </div>
          )}

          {contact.fourDigits && (
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Phone className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">4 chiffres interne</p>
                <p className="font-medium">{contact.fourDigits}</p>
              </div>
            </div>
          )}

          {contact.fourDigitsXX && (
             <div className="flex items-center gap-4 rounded-lg border p-4">
              <Phone className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">4 chiffres MDN</p>
                <p className="font-medium">{contact.fourDigitsXX}</p>
              </div>
            </div>
          )}
          
          {contact.fourDigitsYY && (
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Smartphone className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">GSM (4/10 chiffres)</p>
                <p className="font-medium">{contact.fourDigitsYY}</p>
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
