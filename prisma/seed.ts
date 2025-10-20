// @ts-ignore
const { PrismaClient } = require('@prisma/client');
// @ts-ignore
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  // await prisma.contact.deleteMany();
  // await prisma.subDepartment.deleteMany();
  // await prisma.structure.deleteMany();
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
