import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { GRADE_ORDER } from '@/lib/config';
import type { Contact } from '@/lib/types';

// Use caching for PrismaClient in Next.js environment
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json([]);
  }

  // NOTE: On SQLite, the 'mode: "insensitive"' parameter is not supported. 
  // We remove it. The default behavior of 'contains' on SQLite is often 
  // case-insensitive for text fields, or we would need to use raw SQL.

  try {
    const contacts: Contact[] = await prisma.contact.findMany({
      where: {
        OR: [
          // REMOVED: mode: 'insensitive' from name
          { name: { contains: q } },
          // REMOVED: mode: 'insensitive' from title
          { title: { contains: q } },
          // Phone number fields (no mode needed as they are case-insensitive anyway)
          { threeDigits: { contains: q } },
          { fourDigits: { contains: q } },
          { fourDigitsXX: { contains: q } },
          { fourDigitsYY: { contains: q } },
          // Nested relations
          // REMOVED: mode: 'insensitive' from structure name
          { structure: { name: { contains: q } } },
          // REMOVED: mode: 'insensitive' from subDepartment name
          { subDepartment: { name: { contains: q } } },
        ],
      },
      include: {
        structure: true,
        subDepartment: true,
      },
    });

    // Custom sort based on GRADE_ORDER
    contacts.sort((a, b) => {
      const indexA = GRADE_ORDER.indexOf(a.title);
      const indexB = GRADE_ORDER.indexOf(b.title);

      // If both titles are in GRADE_ORDER, sort by their index
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      // If only contact A's title is in GRADE_ORDER, it comes first
      if (indexA !== -1) {
        return -1;
      }
      // If only contact B's title is in GRADE_ORDER, it comes first
      if (indexB !== -1) {
        return 1;
      }
      // If neither title is in GRADE_ORDER, keep their original relative order (or sort alphabetically by name)
      return a.name.localeCompare(b.name);
    });

    const formattedContacts = contacts.map(c => ({
        ...c,
        structureName: c.structure.name,
        subDepartmentName: c.subDepartment?.name
    }));

    return NextResponse.json(formattedContacts);
  } catch (error) {
    // You should ensure the error is logged without revealing stack traces to the client
    console.error('Search failed', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
