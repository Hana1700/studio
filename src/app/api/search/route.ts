import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
    const contacts = await prisma.contact.findMany({
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