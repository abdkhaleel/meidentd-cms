// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path'; 

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
// ----------------------------

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const databaseUrl = process.env.DATABASE_URL; 

  if (!databaseUrl) {
      console.error('\nFATAL ERROR: DATABASE_URL is not loaded from .env file.');
      process.exit(1);
  }
  if (!username || !password) {
    console.error(
      '\nFATAL ERROR: ADMIN_USERNAME and ADMIN_PASSWORD must be set in your .env file.'
    );
    process.exit(1);
  }
  // ----------------------------

  console.log('Successfully loaded environment variables.');
  const hashedPassword = await hash(password, 12);

  const existingAdmin = await prisma.user.findUnique({
    where: { username },
  });

  if (!existingAdmin) {
    const user = await prisma.user.create({
      data: {
        username: username,
        password_hash: hashedPassword,
        role: 'admin',
      },
    });
    console.log(`Admin user '${username}' created successfully.`);
  } else {
    console.log(`Admin user '${username}' already exists. Seeding skipped.`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });