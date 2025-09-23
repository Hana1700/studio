import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type BreadcrumbItem = {
  label: string;
  href: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('mb-6', className)}>
      <ol className="flex items-center space-x-1 text-sm text-muted-foreground md:space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <Link
              href={item.href}
              className={cn(
                'capitalize hover:text-primary',
                index === items.length - 1 &&
                  'font-medium text-foreground pointer-events-none'
              )}
              aria-current={index === items.length - 1 ? 'page' : undefined}
            >
              {item.label}
            </Link>
            {index < items.length - 1 && (
              <ChevronRight className="ml-1 h-4 w-4 flex-shrink-0 md:ml-2" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
