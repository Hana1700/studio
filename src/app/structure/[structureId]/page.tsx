import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumb';
import type { Structure, Contact, SubDepartment } from '@/lib/types';
import { PrismaClient } from '@prisma/client';
import { Building, Users, Library, ChevronRight } from 'lucide-react';
import { ContactList } from '@/components/contact-list';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getStructure(structureId: string): Promise<(Structure & { directContacts: Contact[] }) | null> {
    const structure = await prisma.structure.findUnique({
        where: { id: structureId },
        include: {
            subDepartments: {
                include: {
                    _count: {
                        select: { contacts: true }
                    }
                }
            },
        },
    });

    if (!structure) return null;

    const directContacts = await prisma.contact.findMany({
        where: {
            structureId: structureId,
            subDepartmentId: null,
        },
        include: {
            structure: true,
            subDepartment: true,
        }
    });
    
    const formattedContacts = directContacts.map(c => ({
        ...c,
        structureName: c.structure.name,
        subDepartmentName: c.subDepartment?.name
    }));


    return {
        ...structure,
        directContacts: formattedContacts,
        subDepartments: structure.subDepartments.map(sd => ({
            ...sd,
            contacts: [], // This is not needed on this page, but keeps type consistency.
            _count: sd._count,
        })),
    };
}


export default async function StructurePage({
  params,
}: {
  params: { structureId: string };
}) {
  const structure = await getStructure(params.structureId);

  if (!structure) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    { label: structure.name, href: `/structure/${structure.id}` },
  ];

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {structure.name}
        </h1>
        <p className="mt-1 text-muted-foreground">{structure.description}</p>
      </div>

      <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold mb-4">Sous-directions</h2>
            {structure.subDepartments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {structure.subDepartments.map((sub) => (
                         <Link href={`/structure/${structure.id}/${sub.id}`} key={sub.id} className="block">
                            <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Library className="h-5 w-5 text-primary" />
                                        {sub.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>{sub._count?.contacts ?? 0} contact(s)</span>
                                    </div>
                                </CardContent>
                                <div className="flex justify-end p-4 pt-0">
                                   <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </Card>
                         </Link>
                    ))}
                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-24 text-center">
                    <p className="text-muted-foreground">Aucune sous-direction disponible pour cette structure.</p>
                </div>
            )}
        </div>
        
        <Separator />
        
        <div>
            <h2 className="text-2xl font-bold mb-4">Contacts directs</h2>
            <ContactList contacts={structure.directContacts} />
        </div>
      </div>
    </div>
  );
}
