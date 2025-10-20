import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, structureId } = body;

        if (!name || !structureId) {
            return NextResponse.json({ error: 'Name and structureId are required' }, { status: 400 });
        }

        const maxOrder = await prisma.subDepartment.aggregate({
            where: {
                structureId: structureId,
            },
            _max: {
                displayOrder: true,
            },
        });

        const newSubDepartment = await prisma.subDepartment.create({
            data: {
                name,
                structureId,
                displayOrder: (maxOrder._max.displayOrder ?? -1) + 1,
            },
        });

        return NextResponse.json(newSubDepartment, { status: 201 });
    } catch (error) {
        console.error('Failed to create sub-department', error);
        return NextResponse.json({ error: 'Failed to create sub-department' }, { status: 500 });
    }
}
