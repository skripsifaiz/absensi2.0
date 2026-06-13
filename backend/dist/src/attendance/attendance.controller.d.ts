import { AttendanceService } from './attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    getTodayStatus(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        userId: string;
        date: Date;
        checkInTime: Date | null;
        checkOutTime: Date | null;
        checkInLat: number | null;
        checkInLng: number | null;
        checkOutLat: number | null;
        checkOutLng: number | null;
    } | null>;
    checkIn(body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        userId: string;
        date: Date;
        checkInTime: Date | null;
        checkOutTime: Date | null;
        checkInLat: number | null;
        checkInLng: number | null;
        checkOutLat: number | null;
        checkOutLng: number | null;
    }>;
    checkOut(body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        userId: string;
        date: Date;
        checkInTime: Date | null;
        checkOutTime: Date | null;
        checkInLat: number | null;
        checkInLng: number | null;
        checkOutLat: number | null;
        checkOutLng: number | null;
    }>;
    getHistory(userId: string, startDate?: string, endDate?: string, status?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        userId: string;
        date: Date;
        checkInTime: Date | null;
        checkOutTime: Date | null;
        checkInLat: number | null;
        checkInLng: number | null;
        checkOutLat: number | null;
        checkOutLng: number | null;
    }[]>;
    getStats(userId: string): Promise<{
        rate: string;
        present: number;
        late: number;
        izin: number;
        alpa: number;
        total: number;
    }>;
    getAdminStats(): Promise<{
        todayStats: {
            present: number;
            late: number;
            alpa: number;
            unreported: number;
            totalTeachers: number;
        };
        pendingCorrections: number;
    }>;
    getAdminDashboard(): Promise<{
        stats: {
            todayStats: {
                present: number;
                late: number;
                alpa: number;
                unreported: number;
                totalTeachers: number;
            };
            pendingCorrections: number;
        };
        recentAttendances: ({
            user: {
                name: string;
                nip: string;
                position: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.AttendanceStatus;
            userId: string;
            date: Date;
            checkInTime: Date | null;
            checkOutTime: Date | null;
            checkInLat: number | null;
            checkInLng: number | null;
            checkOutLat: number | null;
            checkOutLng: number | null;
        })[];
    }>;
}
