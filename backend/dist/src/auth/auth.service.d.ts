import { PrismaService } from '../infrastructure/prisma/prisma.service';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    login(nip: string, password: string): Promise<{
        id: string;
        nip: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        position: string | null;
        phone: string | null;
    }>;
    registerTeacher(data: {
        nip: string;
        email: string;
        name: string;
        password: string;
        phone?: string;
        position?: string;
    }): Promise<{
        id: string;
        name: string;
        nip: string;
        email: string;
        position: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    getTeachers(): Promise<{
        id: string;
        name: string;
        nip: string;
        email: string;
        position: string | null;
    }[]>;
}
