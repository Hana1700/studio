
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { subDepartmentId: string } }) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const updatedSubDepartment = await prisma.subDepartment.update({
            where: { id: params.subDepartmentId },
            data: {
                name,
            }
        });

        return NextResponse.json(updatedSubDepartment);
    } catch (error) {
        console.error(`Failed to update sub-department ${params.subDepartmentId}`, error);
        return NextResponse.json({ error: 'Failed to update sub-department' }, { status: 500 });
    }
}


export async function DELETE(request: Request, { params }: { params: { subDepartmentId: string } }) {
    try {
        await prisma.subDepartment.delete({
            where: { id: params.subDepartmentId },
        });
        return NextResponse.json({ message: 'Sub-department deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(`Failed to delete sub-department ${params.subDepartmentId}`, error);
        return NextResponse.json({ error: 'Failed to delete sub-department' }, { status: 500 });
    }
}

    