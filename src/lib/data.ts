import type { Structure } from '@/lib/types';
import {
  Building,
} from 'lucide-react';

export const structures: Structure[] = [
  {
    id: 'direction-generale',
    name: 'Direction de ....',
    icon: Building,
    description: 'Management et direction de l\'entreprise.',
    subDepartments: [
      {
        id: 'presidence',
        name: 'Sous-direction de...',
        icon: Building,
        contacts: [
          {
            id: '1',
            name: 'Jean Dupont',
            title: 'Président Directeur Général',
            phone: '01 23 45 67 89',
            mobile: '06 12 34 56 78',
            email: 'j.dupont@example.com',
          },
          {
            id: 'secreteriat-presidence',
            name: 'Secrétariat',
            title: 'Secrétariat du Président',
            phone: '01 23 45 67 91',
            email: 'secretariat.presidence@example.com',
          },
          {
            id: '2',
            name: 'Claire Martin',
            title: 'Assistante de Direction',
            phone: '01 23 45 67 90',
            email: 'c.martin@example.com',
          },
        ],
      },
      {
        id: 'sous-direction-2',
        name: 'Sous-direction de...',
        icon: Building,
        contacts: [],
      },
      {
        id: 'sous-direction-3',
        name: 'Sous-direction de...',
        icon: Building,
        contacts: [],
      },
    ],
  },
  {
    id: 'departement-informatique',
    name: 'Direction de ....',
    icon: Building,
    description: 'Gestion des systèmes d\'information et technologies.',
    subDepartments: [
      {
        id: 'reseau',
        name: 'Sous-direction de...',
        icon: Building,
        contacts: [
          {
            id: '3',
            name: 'Paul Bernard',
            title: 'Chef de sous-direction',
            phone: '01 34 56 78 11',
            email: 'p.bernard@example.com',
          },
          {
            id: 'secretariat-reseau',
            name: 'Secrétariat',
            title: 'Secrétariat',
            phone: '01 34 56 78 10',
            email: 'secretariat.reseau@example.com',
          },
          {
            id: '4',
            name: 'Sophie Dubois',
            title: 'Technicienne Réseau',
            phone: '01 34 56 78 12',
            mobile: '06 23 45 67 89',
            email: 's.dubois@example.com',
          },
        ],
      },
      {
        id: 'developpement',
        name: 'Sous-direction de...',
        icon: Building,
        contacts: [
          {
            id: '5',
            name: 'Marc Petit',
            title: 'Chef de sous-direction',
            phone: '01 34 56 78 21',
            mobile: '06 34 56 78 90',
            email: 'm.petit@example.com',
          },
          {
            id: 'secretariat-dev',
            name: 'Secrétariat',
            title: 'Secrétariat',
            phone: '01 34 56 78 20',
            email: 'secretariat.dev@example.com',
          },
          {
            id: '6',
            name: 'Lucie Durand',
            title: 'Développeuse Frontend',
            phone: '01 34 56 78 22',
            email: 'l.durand@example.com',
          },
        ],
      },
      {
        id: 'support-technique',
        name: 'Sous-direction de...',
        icon: Building,
        contacts: [
          {
            id: '7',
            name: 'Alice Moreau',
            title: 'Chef de sous-direction',
            phone: '01 34 56 78 31',
            mobile: '06 45 67 89 01',
            email: 'a.moreau@example.com',
          },
          {
            id: 'secretariat-support',
            name: 'Secrétariat',
            title: 'Secrétariat',
            phone: '01 34 56 78 30',
            email: 'secretariat.support@example.com',
          },
        ],
      },
    ],
  },
  {
    id: 'ressources-humaines',
    name: 'Direction de ....',
    icon: Building,
    description: 'Gestion du personnel et des relations sociales.',
    subDepartments: [
      {
        id: 'recrutement',
        name: 'Sous-direction de...',
        icon: Building,
        contacts: [
          {
            id: '8',
            name: 'Thomas Leroy',
            title: 'Chef de sous-direction',
            phone: '01 45 67 89 01',
            email: 't.leroy@example.com',
          },
          {
            id: 'secretariat-rh',
            name: 'Secrétariat',
            title: 'Secrétariat',
            phone: '01 45 67 89 00',
            email: 'secretariat.rh@example.com',
          },
        ],
      },
       {
        id: 'sous-direction-rh-2',
        name: 'Sous-direction de...',
        icon: Building,
        contacts: [],
      },
      {
        id: 'sous-direction-rh-3',
        name: 'Sous-direction de...',
        icon: Building,
        contacts: [],
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Direction de ....',
    icon: Building,
    description: 'Promotion de l\'image et des produits de l\'entreprise.',
    subDepartments: [
      {
        id: 'sous-direction-mkt-1',
        name: 'Sous-direction de...',
        icon: Building,
        contacts: [],
      },
      {
        id: 'sous-direction-mkt-2',
        name: 'Sous-direction de...',
        icon: Building,
        contacts: [],
      },
      {
        id: 'sous-direction-mkt-3',
        name: 'Sous-direction de...',
        icon: Building,
        contacts: [],
      },
    ],
  },
    {
    id: 'direction-5',
    name: 'Direction de ....',
    icon: Building,
    description: 'Nouvelle direction',
    subDepartments: [
      { id: 'dir5-sd1', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir5-sd2', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir5-sd3', name: 'Sous-direction de...', icon: Building, contacts: [] },
    ],
  },
  {
    id: 'direction-6',
    name: 'Direction de ....',
    icon: Building,
    description: 'Nouvelle direction',
    subDepartments: [
      { id: 'dir6-sd1', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir6-sd2', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir6-sd3', name: 'Sous-direction de...', icon: Building, contacts: [] },
    ],
  },
  {
    id: 'direction-7',
    name: 'Direction de ....',
    icon: Building,
    description: 'Nouvelle direction',
    subDepartments: [
      { id: 'dir7-sd1', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir7-sd2', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir7-sd3', name: 'Sous-direction de...', icon: Building, contacts: [] },
    ],
  },
  {
    id: 'direction-8',
    name: 'Direction de ....',
    icon: Building,
    description: 'Nouvelle direction',
    subDepartments: [
      { id: 'dir8-sd1', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir8-sd2', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir8-sd3', name: 'Sous-direction de...', icon: Building, contacts: [] },
    ],
  },
  {
    id: 'direction-9',
    name: 'Direction de ....',
    icon: Building,
    description: 'Nouvelle direction',
    subDepartments: [
      { id: 'dir9-sd1', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir9-sd2', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir9-sd3', name: 'Sous-direction de...', icon: Building, contacts: [] },
    ],
  },
  {
    id: 'direction-10',
    name: 'Direction de ....',
    icon: Building,
    description: 'Nouvelle direction',
    subDepartments: [
      { id: 'dir10-sd1', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir10-sd2', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir10-sd3', name: 'Sous-direction de...', icon: Building, contacts: [] },
    ],
  },
  {
    id: 'direction-11',
    name: 'Direction de ....',
    icon: Building,
    description: 'Nouvelle direction',
    subDepartments: [
      { id: 'dir11-sd1', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir11-sd2', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir11-sd3', name: 'Sous-direction de...', icon: Building, contacts: [] },
    ],
  },
  {
    id: 'direction-12',
    name: 'Direction de ....',
    icon: Building,
    description: 'Nouvelle direction',
    subDepartments: [
      { id: 'dir12-sd1', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir12-sd2', name: 'Sous-direction de...', icon: Building, contacts: [] },
      { id: 'dir12-sd3', name: 'Sous-direction de...', icon: Building, contacts: [] },
    ],
  },
];

export const allContacts = structures.flatMap((structure) =>
  structure.subDepartments.flatMap((subDept) =>
    subDept.contacts.map((contact) => ({
      ...contact,
      subDepartmentName: subDept.name,
      structureName: structure.name,
      structureId: structure.id,
      subDepartmentId: subDept.id,
    }))
  )
);
