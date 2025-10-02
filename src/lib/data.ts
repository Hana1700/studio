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
        name: 'Présidence',
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
            id: '2',
            name: 'Claire Martin',
            title: 'Assistante de Direction',
            phone: '01 23 45 67 90',
            email: 'c.martin@example.com',
          },
        ],
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
        name: 'Réseau',
        icon: Building,
        contacts: [
          {
            id: '3',
            name: 'Paul Bernard',
            title: 'Administrateur Réseau',
            phone: '01 34 56 78 11',
            email: 'p.bernard@example.com',
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
        name: 'Développement',
        icon: Building,
        contacts: [
          {
            id: '5',
            name: 'Marc Petit',
            title: 'Développeur Full-Stack',
            phone: '01 34 56 78 21',
            mobile: '06 34 56 78 90',
            email: 'm.petit@example.com',
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
        name: 'Support Technique',
        icon: Building,
        contacts: [
          {
            id: '7',
            name: 'Alice Moreau',
            title: 'Responsable Support',
            phone: '01 34 56 78 31',
            mobile: '06 45 67 89 01',
            email: 'a.moreau@example.com',
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
        name: 'Recrutement',
        icon: Building,
        contacts: [
          {
            id: '8',
            name: 'Thomas Leroy',
            title: 'Chargé de Recrutement',
            phone: '01 45 67 89 01',
            email: 't.leroy@example.com',
          },
        ],
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Direction de ....',
    icon: Building,
    description: 'Promotion de l\'image et des produits de l\'entreprise.',
    subDepartments: [],
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
