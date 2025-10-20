
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { structureId: string } }) {
  try {
    const structure = await prisma.structure.findUnique({
      where: { id: params.structureId },
      include: {
        subDepartments: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });

    if (!structure) {
      return NextResponse.json({ error: 'Structure not found' }, { status: 404 });
    }

    return NextResponse.json(structure);
  } catch (error) {
    console.error(`Failed to fetch structure ${params.structureId}`, error);
    return NextResponse.json({ error: 'Failed to fetch structure' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { structureId: string } }) {
    try {
        const body = await request.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const updatedStructure = await prisma.structure.update({
            where: { id: params.structureId },
            data: {
                name,
                description,
            }
        });

        return NextResponse.json(updatedStructure);
    } catch (error) {
        console.error(`Failed to update structure ${params.structureId}`, error);
        return NextResponse.json({ error: 'Failed to update structure' }, { status: 500 });
    }
}


export async function DELETE(request: Request, { params }: { params: { structureId: string } }) {
    try {
        await prisma.structure.delete({
            where: { id: params.structureId },
        });
        return NextResponse.json({ message: 'Structure deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(`Failed to delete structure ${params.structureId}`, error);
        return NextResponse.json({ error: 'Failed to delete structure' }, { status: 500 });
    }
}

    
