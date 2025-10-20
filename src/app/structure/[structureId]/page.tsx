import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumb';
import { SubDepartmentList } from '@/components/sub-department-list';
import type { Structure, Contact } from '@/lib/types';
import { PrismaClient } from '@prisma/client';
import { Building } from 'lucide-react';
import { ContactList } from '@/components/contact-list';
import { Separator } from '@/components/ui/separator';

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
        icon: Building,
        subDepartments: structure.subDepartments.map(sd => ({
            ...sd,
            icon: Building,
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
    { label: 'Parcourir', href: '/browse' },
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
            <SubDepartmentList structure={structure} />
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
