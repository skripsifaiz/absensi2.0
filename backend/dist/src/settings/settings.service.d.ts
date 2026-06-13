import { PrismaService } from '../infrastructure/prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: string;
        latitude: number;
        longitude: number;
        radius: number;
        startTime: string;
        endTime: string;
        lateThreshold: number;
        geofenceActive: boolean;
        schoolName: string;
        contactEmail: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateSettings(data: any): Promise<{
        id: string;
        latitude: number;
        longitude: number;
        radius: number;
        startTime: string;
        endTime: string;
        lateThreshold: number;
        geofenceActive: boolean;
        schoolName: string;
        contactEmail: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
