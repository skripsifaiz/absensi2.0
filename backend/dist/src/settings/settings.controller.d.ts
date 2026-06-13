import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
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
    updateSettings(body: any): Promise<{
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
