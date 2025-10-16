import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { contactId: string } }) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: params.contactId },
      include: {
        structure: true,
        subDepartment: true,
      },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
    
    const formattedContact = {
        ...contact,
        structureName: contact.structure.name,
        subDepartmentName: contact.subDepartment?.name
    };

    return NextResponse.json(formattedContact);
  } catch (error) {
    console.error(`Failed to fetch contact ${params.contactId}`, error);
    return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { contactId: string } }) {
    try {
        const body = await request.json();
        const { name, title, threeDigits, fourDigits, fourDigitsXX, fourDigitsYY, structureId, subDepartmentId } = body;

        if (!name || !title || !structureId) {
            return NextResponse.json({ error: 'Name, title and structureId are required' }, { status: 400 });
        }

        const updatedContact = await prisma.contact.update({
            where: { id: params.contactId },
            data: {
                name,
                title,
                threeDigits,
                fourDigits,
                fourDigitsXX,
                fourDigitsYY,
                structureId,
                subDepartmentId: subDepartmentId || null,
            }
        });

        return NextResponse.json(updatedContact);
    } catch (error) {
        console.error(`Failed to update contact ${params.contactId}`, error);
        return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
    }
}


export async function DELETE(request: Request, { params }: { params: { contactId: string } }) {
    try {
        await prisma.contact.delete({
            where: { id: params.contactId },
        });
        return NextResponse.json({ message: 'Contact deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(`Failed to delete contact ${params.contactId}`, error);
        return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }
}
