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
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

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
        <h2 className={cn("mb-2 px-4 font-headline text-lg font-semibold tracking-tight", !open && "hidden")}>
          Structures
        </h2>
         <Accordion type="single" collapsible defaultValue={activeStructureId ? `item-${activeStructureId}` : undefined} className={cn("space-y-1", !open && "w-full")}>
          {structures.map((structure) => {
            const isActiveStructure = pathname.startsWith(`/structure/${structure.id}`);
            return (
            <AccordionItem value={`item-${structure.id}`} key={structure.id} className="border-b-0">
              <SidebarMenuItem>
                <AccordionTrigger 
                  className={cn(
                    "hover:no-underline rounded-md [&[data-state=open]>svg]:hidden",
                    !open ? "p-0" : "p-2",
                  )}
                >
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActiveStructure && !structure.subDepartments.length}
                    tooltip={structure.name}
                    className={cn(
                      "w-full justify-between",
                      !open ? "justify-center" : "",
                      // Prevent hover styles on the trigger when it's used for the accordion
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Link href={`/structure/${structure.id}`}>
                      <div className="flex items-center gap-2">
                        <structure.icon className="h-5 w-5 shrink-0 text-primary" />
                        <span className={cn("truncate", !open && "hidden")}>{structure.name}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </AccordionTrigger>
              </SidebarMenuItem>
              {open && (
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
              )}
            </AccordionItem>
          )})}
        </Accordion>
      </div>
    </div>
  );
}
