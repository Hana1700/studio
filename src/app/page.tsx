import { PrismaClient } from '@prisma/client';
import type { Structure } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Building, Users, Library, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getStructures(): Promise<Structure[]> {
    const structures = await prisma.structure.findMany({
        include: {
            subDepartments: {
                select: {
                    id: true,
                }
            },
        },
    });

    const contactsCount = await prisma.contact.groupBy({
        by: ['structureId'],
        _count: {
            _all: true,
        },
    });

    const contactCountMap = contactsCount.reduce((acc, curr) => {
        if(curr.structureId) {
            acc[curr.structureId] = curr._count._all;
        }
        return acc;
    }, {} as Record<string, number>);

    return structures.map(s => ({
        ...s,
        subDepartments: s.subDepartments,
        contactsCount: contactCountMap[s.id] || 0,
        contacts: [], // Added for type consistency
    }));
}


export default async function Home() {
    const structures = await getStructures();
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">
                    Parcourir l'annuaire
                </h1>
                <p className="text-muted-foreground">Naviguez à travers les structures de l'organisation.</p>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {structures.map(structure => (
                <Link href={`/structure/${structure.id}`} key={structure.id} className="block">
                    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5 text-primary" />
                                {structure.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 h-10">{structure.description || 'Pas de description'}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Library className="h-4 w-4" />
                                <span>{structure.subDepartments.length} sous-direction(s)</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{(structure as any).contactsCount || 0} contact(s)</span>
                            </div>
                        </CardContent>
                        <div className="flex justify-end p-4 pt-0">
                           <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </Card>
                 </Link>
                ))}
            </div>
        </div>
    );
}
