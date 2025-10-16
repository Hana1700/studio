import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const contacts = await prisma.contact.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { title: { contains: q, mode: 'insensitive' } },
          { threeDigits: { contains: q } },
          { fourDigits: { contains: q } },
          { fourDigitsXX: { contains: q } },
          { fourDigitsYY: { contains: q } },
          { structure: { name: { contains: q, mode: 'insensitive' } } },
          { subDepartment: { name: { contains: q, mode: 'insensitive' } } },
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
    console.error('Search failed', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
