"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in the environment variables');
}
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Seeding database...');
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
    }
    else {
        console.log('SchoolConfig already exists.');
    }
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
                password: 'admin123',
                role: 'ADMIN',
                position: 'Sistem Administrator',
                status: 'ACTIVE',
            },
        });
        console.log(`Admin user seeded. NIP: ${adminNip}, Password: admin123`);
    }
    else {
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
//# sourceMappingURL=seed.js.map