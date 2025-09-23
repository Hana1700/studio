import Link from 'next/link';
import { structures } from '@/lib/data';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {structures.map((structure) => (
          <Link href={`/structure/${structure.id}`} key={structure.id}>
            <Card className="h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <structure.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline">{structure.name}</CardTitle>
                <CardDescription>
                  {structure.subDepartments.length} sous-directions
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
