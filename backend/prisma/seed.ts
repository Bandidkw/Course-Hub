import { PrismaClient } from './generated/client/index.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('./prisma/dev.db');
const adapter = new PrismaBetterSqlite3(db);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('admin1234', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'System Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Seed data created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Note: adapter-better-sqlite3 handles closing
  });
