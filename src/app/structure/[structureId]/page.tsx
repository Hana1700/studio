import { notFound } from 'next/navigation';
import Link from 'next/link';
import { structures } from '@/lib/data';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Breadcrumbs } from '@/components/breadcrumb';

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

      {structure.subDepartments.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {structure.subDepartments.map((sub) => (
            <Link
              href={`/structure/${structure.id}/${sub.id}`}
              key={sub.id}
            >
              <Card className="h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <sub.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">{sub.name}</CardTitle>
                  <CardDescription>
                    {sub.contacts.length} contact(s)
                  </CardDescription>
                </CardHeader>
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
  );
}
