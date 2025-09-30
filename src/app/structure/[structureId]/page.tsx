import { notFound } from 'next/navigation';
import { structures } from '@/lib/data';
import { Breadcrumbs } from '@/components/breadcrumb';
import { SubDepartmentList } from '@/components/sub-department-list';

export async function generateStaticParams() {
  return structures.map((structure) => ({
    structureId: structure.id,
  }));
}

export default function StructurePage({
  params,
}: {
  params: { structureId: string };
}) {
  const structure = structures.find((s) => s.id === params.structureId);

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
