import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        id: string;
        nip: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        position: string | null;
        phone: string | null;
    }>;
    registerTeacher(body: any): Promise<{
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
