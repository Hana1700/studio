import { notFound } from 'next/navigation';
import { structures } from '@/lib/data';
import { Breadcrumbs } from '@/components/breadcrumb';
import { ContactList } from '@/components/contact-list';

export default function SubDepartmentPage({
  params,
}: {
  params: { structureId: string; subDepartmentId: string };
}) {
  const structure = structures.find((s) => s.id === params.structureId);
  const subDepartment = structure?.subDepartments.find(
    (sd) => sd.id === params.subDepartmentId
  );

  if (!structure || !subDepartment) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    { label: structure.name, href: `/structure/${structure.id}` },
    {
      label: subDepartment.name,
      href: `/structure/${structure.id}/${subDepartment.id}`,
    },
  ];

  const contactsWithSubDepartment = subDepartment.contacts.map(contact => ({
    ...contact,
    subDepartmentName: subDepartment.name,
  }));

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            {subDepartment.name}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Liste des contacts pour la sous-direction {subDepartment.name}.
          </p>
        </div>
      </div>

      <ContactList contacts={contactsWithSubDepartment} />
    </div>
  );
}
