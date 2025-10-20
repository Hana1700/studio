import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumb';
import { ContactList } from '@/components/contact-list';
import { PrismaClient } from '@prisma/client';
import type { Structure, SubDepartment } from '@/lib/types';

const prisma = new PrismaClient();

async function getSubDepartmentData(structureId: string, subDepartmentId: string) {
    const structure = await prisma.structure.findUnique({
        where: { id: structureId },
    });

    const subDepartment = await prisma.subDepartment.findUnique({
        where: { id: subDepartmentId },
        include: {
            contacts: {
              orderBy: {
                displayOrder: 'asc'
              },
              include: {
                structure: true,
                subDepartment: true,
              }
            }
        }
    });

    if (!structure || !subDepartment) {
        return { structure: null, subDepartment: null };
    }
    
    const formattedSubDepartment = {
      ...subDepartment,
      contacts: subDepartment.contacts.map(c => ({
        ...c,
        structureName: c.structure.name,
        subDepartmentName: c.subDepartment?.name
      }))
    };

    return { structure, subDepartment: formattedSubDepartment };
}


export default async function SubDepartmentPage({
  params,
}: {
  params: { structureId: string; subDepartmentId: string };
}) {
  const { structure, subDepartment } = await getSubDepartmentData(params.structureId, params.subDepartmentId);

  if (!structure || !subDepartment) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    { label: structure.name, href: `/structure/${structure.id}` },
    {
      label: subDepartment.name,
      href: `/structure/${structure.id}/${subDepartment.id}`,
    },
  ];
  
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            {subDepartment.name}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Liste des contacts pour la sous-direction {subDepartment.name}.
          </p>
        </div>
      </div>

      <ContactList contacts={subDepartment.contacts} />
    </div>
  );
}
