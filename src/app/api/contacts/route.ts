import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        structure: true,
        subDepartment: true,
      },
    });
    const formattedContacts = contacts.map(c => ({
        ...c,
        structureName: c.structure.name,
        subDepartmentName: c.subDepartment?.name
    }))
    return NextResponse.json(formattedContacts);
  } catch (error) {
    console.error('Failed to fetch contacts', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, title, threeDigits, fourDigits, fourDigitsXX, fourDigitsYY, structureId, subDepartmentId } = body;

        if (!name || !title || !structureId) {
            return NextResponse.json({ error: 'Name, title and structureId are required' }, { status: 400 });
        }
        
        const contactData = {
            name,
            title,
            threeDigits,
            fourDigits,
            fourDigitsXX,
            fourDigitsYY,
            structureId,
            subDepartmentId: subDepartmentId || null,
        };

        const newContact = await prisma.contact.create({
            data: contactData
        });

        return NextResponse.json(newContact, { status: 201 });
    } catch (error) {
        console.error('Failed to create contact', error);
        return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
    }
}
