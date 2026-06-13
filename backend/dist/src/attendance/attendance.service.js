"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../infrastructure/prisma/prisma.service");
const client_1 = require("@prisma/client");
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getTodayDate() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    }
    async getTodayStatus(userId) {
        const today = this.getTodayDate();
        return this.prisma.attendance.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: today,
                },
            },
        });
    }
    async checkIn(userId, lat, lng) {
        const userExists = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!userExists) {
            throw new common_1.NotFoundException('Staf/Guru tidak ditemukan.');
        }
        const today = this.getTodayDate();
        const existing = await this.prisma.attendance.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: today,
                },
            },
        });
        if (existing && existing.checkInTime) {
            throw new common_1.ConflictException('Anda sudah melakukan Check-In hari ini.');
        }
        const config = await this.prisma.schoolConfig.findFirst();
        let status = client_1.AttendanceStatus.HADIR;
        if (config) {
            const now = new Date();
            const [startHour, startMinute] = config.startTime.split(':').map(Number);
            const startCompare = new Date(now);
            startCompare.setHours(startHour, startMinute, 0, 0);
            const lateThresholdMs = config.lateThreshold * 60 * 1000;
            const limitTime = new Date(startCompare.getTime() + lateThresholdMs);
            if (now > limitTime) {
                status = client_1.AttendanceStatus.TERLAMBAT;
            }
        }
        if (existing) {
            return this.prisma.attendance.update({
                where: { id: existing.id },
                data: {
                    checkInTime: new Date(),
                    checkInLat: lat,
                    checkInLng: lng,
                    status,
                },
            });
        }
        return this.prisma.attendance.create({
            data: {
                userId,
                date: today,
                checkInTime: new Date(),
                checkInLat: lat,
                checkInLng: lng,
                status,
            },
        });
    }
    async checkOut(userId, lat, lng) {
        const today = this.getTodayDate();
        const existing = await this.prisma.attendance.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: today,
                },
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Harap lakukan Check-In terlebih dahulu.');
        }
        if (existing.checkOutTime) {
            throw new common_1.ConflictException('Anda sudah melakukan Check-Out hari ini.');
        }
        return this.prisma.attendance.update({
            where: { id: existing.id },
            data: {
                checkOutTime: new Date(),
                checkOutLat: lat,
                checkOutLng: lng,
            },
        });
    }
    async getHistory(userId, startDate, endDate, status) {
        const whereClause = { userId };
        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) {
                whereClause.date.gte = new Date(startDate);
            }
            if (endDate) {
                whereClause.date.lte = new Date(endDate);
            }
        }
        if (status && status !== 'Semua' && status !== 'Izin / Sakit') {
            let mappedStatus = undefined;
            if (status === 'Hadir')
                mappedStatus = client_1.AttendanceStatus.HADIR;
            else if (status === 'Terlambat')
                mappedStatus = client_1.AttendanceStatus.TERLAMBAT;
            else if (status === 'Alpa')
                mappedStatus = client_1.AttendanceStatus.ALPA;
            else if (status === 'Izin')
                mappedStatus = client_1.AttendanceStatus.IZIN;
            if (mappedStatus) {
                whereClause.status = mappedStatus;
            }
        }
        return this.prisma.attendance.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
        });
    }
    async getStats(userId) {
        const records = await this.prisma.attendance.findMany({
            where: { userId },
        });
        const total = records.length;
        const present = records.filter(r => r.status === client_1.AttendanceStatus.HADIR).length;
        const late = records.filter(r => r.status === client_1.AttendanceStatus.TERLAMBAT).length;
        const izin = records.filter(r => r.status === client_1.AttendanceStatus.IZIN).length;
        const alpa = records.filter(r => r.status === client_1.AttendanceStatus.ALPA).length;
        const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 100;
        return {
            rate: `${rate}%`,
            present,
            late,
            izin,
            alpa,
            total,
        };
    }
    async getAdminStats() {
        const today = this.getTodayDate();
        const todayRecords = await this.prisma.attendance.findMany({
            where: { date: today },
            include: { user: true },
        });
        const present = todayRecords.filter(r => r.status === client_1.AttendanceStatus.HADIR).length;
        const late = todayRecords.filter(r => r.status === client_1.AttendanceStatus.TERLAMBAT).length;
        const alpa = todayRecords.filter(r => r.status === client_1.AttendanceStatus.ALPA).length;
        const totalTeachers = await this.prisma.user.count({ where: { role: 'TEACHER' } });
        const pendingCorrections = await this.prisma.attendanceCorrection.count({
            where: { status: 'PENDING_ADMIN' },
        });
        return {
            todayStats: {
                present,
                late,
                alpa,
                unreported: Math.max(0, totalTeachers - todayRecords.length),
                totalTeachers,
            },
            pendingCorrections,
        };
    }
    async getAdminDashboardSummary() {
        const today = this.getTodayDate();
        const recentAttendances = await this.prisma.attendance.findMany({
            take: 5,
            orderBy: { checkInTime: 'desc' },
            include: {
                user: {
                    select: { name: true, nip: true, position: true }
                }
            }
        });
        const stats = await this.getAdminStats();
        return {
            stats,
            recentAttendances,
        };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map