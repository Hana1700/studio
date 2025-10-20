import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { type, items } = await request.json();

    if (!type || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Type and items array are required' }, { status: 400 });
    }

    const updates = items.map(item => {
        if(type === 'structure') {
            return prisma.structure.update({
                where: { id: item.id },
                data: { displayOrder: item.displayOrder },
            });
        }
        if(type === 'subdepartment') {
            return prisma.subDepartment.update({
                where: { id: item.id },
                data: { displayOrder: item.displayOrder },
            });
        }
        if(type === 'contact') {
            return prisma.contact.update({
                where: { id: item.id },
                data: { displayOrder: item.displayOrder },
            });
        }
    }).filter(Boolean);

    if (updates.length === 0) {
        return NextResponse.json({ error: 'Invalid type provided' }, { status: 400 });
    }

    await prisma.$transaction(updates as any);

    return NextResponse.json({ message: 'Order updated successfully' });

  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
