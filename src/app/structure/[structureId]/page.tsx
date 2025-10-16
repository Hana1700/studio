import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumb';
import { SubDepartmentList } from '@/components/sub-department-list';
import type { Structure } from '@/lib/types';
import { PrismaClient } from '@prisma/client';
import { Building } from 'lucide-react';

const prisma = new PrismaClient();

async function getStructure(structureId: string): Promise<Structure | null> {
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

    return {
        ...structure,
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
      <SubDepartmentList structure={structure} />
    </div>
  );
}
