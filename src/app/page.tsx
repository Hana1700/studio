import Link from 'next/link';
import { structures } from '@/lib/data';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Annuaire de l'entreprise
        </h1>
        <p className="text-muted-foreground">
          Naviguez à travers les structures pour trouver un contact.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <ul className="divide-y">
          {structures.map((structure) => (
            <li key={structure.id}>
              <Link
                href={`/structure/${structure.id}`}
                className="block p-4 hover:bg-muted/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <structure.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{structure.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {structure.subDepartments.length} sous-direction(s)
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
    </div>
  );
}
