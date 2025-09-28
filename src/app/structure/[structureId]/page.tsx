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
import { ChevronRight } from 'lucide-react';

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
        <div className="overflow-hidden rounded-lg border">
          <ul className="divide-y">
            {structure.subDepartments.map((sub) => (
              <li key={sub.id}>
                <Link
                  href={`/structure/${structure.id}/${sub.id}`}
                  className="block p-4 hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <sub.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{sub.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {sub.contacts.length} contact(s)
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-24 text-center">
            <p className="text-muted-foreground">Aucune sous-direction disponible pour cette structure.</p>
        </div>
      )}
    </div>
  );
}
