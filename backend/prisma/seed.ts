import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in the environment variables');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Seed School Settings
  const configCount = await prisma.schoolConfig.count();
  if (configCount === 0) {
    await prisma.schoolConfig.create({
      data: {
        latitude: -6.2088,
        longitude: 106.8456,
        radius: 150,
        startTime: '07:30',
        endTime: '15:30',
        lateThreshold: 15,
        geofenceActive: true,
        schoolName: 'Sekolah Menengah Oakwood',
        contactEmail: 'admin@oakwood.sch.id',
      },
    });
    console.log('Initial SchoolConfig seeded.');
  } else {
    console.log('SchoolConfig already exists.');
  }

  // 2. Seed Admin User
  const adminNip = '111';
  const existingAdmin = await prisma.user.findUnique({
    where: { nip: adminNip },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        nip: adminNip,
        email: 'admin@oakwood.sch.id',
        name: 'Admin Absensi',
        password: 'admin123', // Plain text for simplicity/demo integration
        role: 'ADMIN',
        position: 'Sistem Administrator',
        status: 'ACTIVE',
      },
    });
    console.log(`Admin user seeded. NIP: ${adminNip}, Password: admin123`);
  } else {
    console.log('Admin user already exists.');
  }

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
