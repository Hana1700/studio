import type { LucideIcon } from 'lucide-react';
import { Structure as PrismaStructure, SubDepartment as PrismaSubDepartment, Contact as PrismaContact } from '@prisma/client';

export type Contact = PrismaContact & {
  structureName?: string;
  subDepartmentName?: string;
};

export type SubDepartment = PrismaSubDepartment & {
  contacts: Contact[];
  _count?: {
    contacts: number;
  };
};

export type Structure = PrismaStructure & {
  subDepartments: SubDepartment[];
};
