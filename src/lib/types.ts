import type { LucideIcon } from 'lucide-react';

export interface Contact {
  id: string;
  name: string;
  title: string;
  phone: string;
  mobile?: string;
  email: string;
}

export interface SubDepartment {
  id: string;
  name: string;
  icon: LucideIcon;
  contacts: Contact[];
}

export interface Structure {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  subDepartments: SubDepartment[];
}
