import Link from 'next/link';
import type { Structure } from '@/lib/types';
import { ChevronRight, Building } from 'lucide-react';

export function SubDepartmentList({ structure }: { structure: Structure }) {
  if (structure.subDepartments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-24 text-center">
        <p className="text-muted-foreground">
          Aucune sous-direction disponible pour cette structure.
        </p>
      </div>
    );
  }

  return (
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
                    <Building className="h-6 w-6 text-primary" />
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
  );
}
