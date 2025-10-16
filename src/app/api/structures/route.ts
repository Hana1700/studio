import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const structures = await prisma.structure.findMany({
      include: {
        subDepartments: {
          include: {
            contacts: true,
          },
        },
      },
    });
    return NextResponse.json(structures);
  } catch (error) {
    console.error('Failed to fetch structures', error);
    return NextResponse.json({ error: 'Failed to fetch structures' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const newStructure = await prisma.structure.create({
            data: {
                name,
                description,
            },
        });

        return NextResponse.json(newStructure, { status: 201 });
    } catch (error) {
        console.error('Failed to create structure', error);
        return NextResponse.json({ error: 'Failed to create structure' }, { status: 500 });
    }
}
