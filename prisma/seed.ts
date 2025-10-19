import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.contact.deleteMany();
  await prisma.subDepartment.deleteMany();
  await prisma.structure.deleteMany();
  await prisma.admin.deleteMany();

  // Seed Admin
  const hashedPassword = await bcrypt.hash('admin', 10);
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  });
  console.log('Admin user created.');

  const s1 = await prisma.structure.create({
    data: {
      name: 'Direction de ....',
      description: 'Management et direction de l\'entreprise.',
    },
  });

  const sd1_1 = await prisma.subDepartment.create({
    data: {
      name: 'Sous-direction de...',
      structureId: s1.id,
    }
  });

  await prisma.contact.createMany({
    data: [
      {
        name: 'Jean Dupont',
        title: 'Président Directeur Général',
        structureId: s1.id,
        subDepartmentId: sd1_1.id,
        threeDigits: '012',
        fourDigits: '3456',
        fourDigitsXX: '7890',
        fourDigitsYY: null
      },
      {
        name: 'Secrétariat',
        title: 'Secrétariat du Président',
        structureId: s1.id,
        subDepartmentId: sd1_1.id,
        threeDigits: '012',
        fourDigits: '3456',
        fourDigitsXX: '7891',
        fourDigitsYY: null
      },
      {
        name: 'Claire Martin',
        title: 'Assistante de Direction',
        structureId: s1.id,
        subDepartmentId: sd1_1.id,
        threeDigits: '012',
        fourDigits: '3456',
        fourDigitsXX: '7892',
        fourDigitsYY: null
      },
    ]
  });

  const sd1_2 = await prisma.subDepartment.create({
    data: { name: 'Sous-direction de...', structureId: s1.id }
  });
  const sd1_3 = await prisma.subDepartment.create({
    data: { name: 'Sous-direction de...', structureId: s1.id }
  });

  const s2 = await prisma.structure.create({
    data: {
      name: 'Direction de ....',
      description: 'Gestion des systèmes d\'information et technologies.',
    }
  });

  const sd2_1 = await prisma.subDepartment.create({
    data: { name: 'Sous-direction de...', structureId: s2.id }
  });

  await prisma.contact.createMany({
    data: [
       {
        name: 'Paul Bernard',
        title: 'Chef de sous-direction',
        structureId: s2.id,
        subDepartmentId: sd2_1.id,
        threeDigits: '013',
        fourDigits: '4567',
        fourDigitsXX: '811',
        fourDigitsYY: null
      },
      {
        name: 'Secrétariat',
        title: 'Secrétariat',
        structureId: s2.id,
        subDepartmentId: sd2_1.id,
        threeDigits: '013',
        fourDigits: '4567',
        fourDigitsXX: '810',
        fourDigitsYY: null
      },
      {
        name: 'Sophie Dubois',
        title: 'Technicienne Réseau',
        structureId: s2.id,
        subDepartmentId: sd2_1.id,
        threeDigits: '013',
        fourDigits: '4567',
        fourDigitsXX: '812',
        fourDigitsYY: '0623'
      },
    ]
  });

  const sd2_2 = await prisma.subDepartment.create({
    data: { name: 'Sous-direction de...', structureId: s2.id }
  });
    await prisma.contact.createMany({
    data: [
       {
        name: 'Marc Petit',
        title: 'Chef de sous-direction',
        structureId: s2.id,
        subDepartmentId: sd2_2.id,
        threeDigits: '013',
        fourDigits: '4567',
        fourDigitsXX: '821',
        fourDigitsYY: null
      },
      {
        name: 'Secrétariat',
        title: 'Secrétariat',
        structureId: s2.id,
        subDepartmentId: sd2_2.id,
        threeDigits: '013',
        fourDigits: '4567',
        fourDigitsXX: '820',
        fourDigitsYY: null
      },
      {
        name: 'Lucie Durand',
        title: 'Développeuse Frontend',
        structureId: s2.id,
        subDepartmentId: sd2_2.id,
        threeDigits: '013',
        fourDigits: '4567',
        fourDigitsXX: '822',
        fourDigitsYY: null
      },
    ]
  });

  const sd2_3 = await prisma.subDepartment.create({
    data: { name: 'Sous-direction de...', structureId: s2.id }
  });
  await prisma.contact.createMany({
      data: [
        {
          name: 'Alice Moreau',
          title: 'Chef de sous-direction',
          structureId: s2.id,
          subDepartmentId: sd2_3.id,
          threeDigits: '013',
          fourDigits: '4567',
          fourDigitsXX: '831',
          fourDigitsYY: '0645'
        },
        {
          name: 'Secrétariat',
          title: 'Secrétariat',
          structureId: s2.id,
          subDepartmentId: sd2_3.id,
          threeDigits: '013',
          fourDigits: '4567',
          fourDigitsXX: '830',
          fourDigitsYY: null
        },
      ]
  })


  const s3 = await prisma.structure.create({
    data: {
      name: 'Direction de ....',
      description: 'Gestion du personnel et des relations sociales.',
    }
  });

  const sd3_1 = await prisma.subDepartment.create({
    data: { name: 'Sous-direction de...', structureId: s3.id }
  });
    await prisma.contact.createMany({
        data: [
        {
          name: 'Thomas Leroy',
          title: 'Chef de sous-direction',
          structureId: s3.id,
          subDepartmentId: sd3_1.id,
          threeDigits: '014',
          fourDigits: '5678',
          fourDigitsXX: '901',
          fourDigitsYY: null
        },
        {
          name: 'Secrétariat',
          title: 'Secrétariat',
          structureId: s3.id,
          subDepartmentId: sd3_1.id,
          threeDigits: '014',
          fourDigits: '5678',
          fourDigitsXX: '900',
          fourDigitsYY: null
        },
        ]
    });

  await prisma.subDepartment.create({ data: { name: 'Sous-direction de...', structureId: s3.id } });
  await prisma.subDepartment.create({ data: { name: 'Sous-direction de...', structureId: s3.id } });

  const s4 = await prisma.structure.create({
    data: {
      name: 'Direction de ....',
      description: 'Promotion de l\'image et des produits de l\'entreprise.',
    }
  });

  await prisma.subDepartment.create({ data: { name: 'Sous-direction de...', structureId: s4.id } });
  await prisma.subDepartment.create({ data: { name: 'Sous-direction de...', structureId: s4.id } });
  await prisma.subDepartment.create({ data: { name: 'Sous-direction de...', structureId: s4.id } });
  
  for (let i=5; i<=12; i++) {
    const s = await prisma.structure.create({
        data: {
            name: `Direction de ....`,
            description: 'Nouvelle direction',
        }
    });
    await prisma.subDepartment.create({ data: { name: 'Sous-direction de...', structureId: s.id } });
    await prisma.subDepartment.create({ data: { name: 'Sous-direction de...', structureId: s.id } });
    await prisma.subDepartment.create({ data: { name: 'Sous-direction de...', structureId: s.id } });
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
