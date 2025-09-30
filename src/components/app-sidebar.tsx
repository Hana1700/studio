'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { structures } from '@/lib/data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();

  const getActiveStructure = () => {
    const parts = pathname.split('/');
    if (parts.length >= 3 && parts[1] === 'structure') {
      return parts[2];
    }
    return null;
  };
  
  const activeStructureId = getActiveStructure();

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 font-headline text-lg font-semibold tracking-tight">
          Structures
        </h2>
        <Accordion type="single" collapsible defaultValue={activeStructureId ? `item-${activeStructureId}` : undefined}>
          {structures.map((structure) => {
            const isActiveStructure = pathname.startsWith(`/structure/${structure.id}`);
            return (
            <AccordionItem value={`item-${structure.id}`} key={structure.id}>
              <AccordionTrigger 
                className={cn("px-4 text-base hover:no-underline hover:bg-muted/50 rounded-md",
                  isActiveStructure && !structure.subDepartments.length ? "bg-muted font-semibold" : ""
                )}
              >
                <Link href={`/structure/${structure.id}`} className="flex items-center w-full">
                  <structure.icon className="mr-3 h-5 w-5 text-primary" />
                  {structure.name}
                </Link>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-1 pl-8 pr-2 py-2 border-l ml-6">
                    {structure.subDepartments.map((sub) => {
                        const isActive = pathname === `/structure/${structure.id}/${sub.id}`;
                        return (
                        <Button
                            key={sub.id}
                            variant="ghost"
                            className={cn("w-full justify-start", isActive && "bg-muted font-semibold")}
                            asChild
                        >
                            <Link href={`/structure/${structure.id}/${sub.id}`}>
                            <sub.icon className="mr-3 h-5 w-5" />
                            {sub.name}
                            </Link>
                        </Button>
                        )
                    })}
                     {structure.subDepartments.length === 0 && (
                        <p className="px-4 text-sm text-muted-foreground">Aucune sous-direction.</p>
                    )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )})}
        </Accordion>
      </div>
    </div>
  );
}
