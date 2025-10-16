import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStructures = () => prisma.structure.findMany({
  include: {
    subDepartments: {
      include: {
        contacts: true,
      },
    },
  },
});

export const getAllContacts = async () => {
  const contacts = await prisma.contact.findMany({
    include: {
      structure: true,
      subDepartment: true,
    },
  });

  return contacts.map(contact => ({
    ...contact,
    structureName: contact.structure.name,
    subDepartmentName: contact.subDepartment?.name || '',
  }));
};
