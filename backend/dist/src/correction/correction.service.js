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
exports.CorrectionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../infrastructure/prisma/prisma.service");
const client_1 = require("@prisma/client");
let CorrectionService = class CorrectionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitCorrection(data) {
        const userExists = await this.prisma.user.findUnique({
            where: { id: data.userId },
        });
        if (!userExists) {
            throw new common_1.NotFoundException('Staf/Guru tidak ditemukan.');
        }
        const correctionDate = new Date(data.date);
        correctionDate.setHours(0, 0, 0, 0);
        const type = data.correctionType === 'Check-In' ? client_1.CorrectionType.CHECK_IN : client_1.CorrectionType.CHECK_OUT;
        const method = data.verificationMethod === 'witness' ? client_1.VerificationMethod.WITNESS : client_1.VerificationMethod.PHOTO;
        const status = method === client_1.VerificationMethod.WITNESS
            ? client_1.CorrectionStatus.PENDING_WITNESS
            : client_1.CorrectionStatus.PENDING_ADMIN;
        return this.prisma.attendanceCorrection.create({
            data: {
                userId: data.userId,
                date: correctionDate,
                correctionType: type,
                reason: data.reason,
                verificationMethod: method,
                witnessId: method === client_1.VerificationMethod.WITNESS ? data.witnessId : null,
                photoUrl: method === client_1.VerificationMethod.PHOTO ? data.photoUrl : null,
                status,
            },
        });
    }
    async getPendingWitnessCorrections(witnessId) {
        return this.prisma.attendanceCorrection.findMany({
            where: {
                witnessId,
                status: client_1.CorrectionStatus.PENDING_WITNESS,
            },
            include: {
                user: {
                    select: { id: true, name: true, nip: true, position: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async witnessApprove(correctionId, action, notes) {
        const correction = await this.prisma.attendanceCorrection.findUnique({
            where: { id: correctionId },
        });
        if (!correction) {
            throw new common_1.NotFoundException('Data permohonan koreksi tidak ditemukan');
        }
        if (correction.status !== client_1.CorrectionStatus.PENDING_WITNESS) {
            throw new common_1.BadRequestException('Permohonan tidak dalam status menunggu persetujuan saksi');
        }
        const nextStatus = action === 'APPROVE'
            ? client_1.CorrectionStatus.PENDING_ADMIN
            : client_1.CorrectionStatus.WITNESS_REJECTED;
        return this.prisma.attendanceCorrection.update({
            where: { id: correctionId },
            data: {
                status: nextStatus,
                reviewNotes: notes || (action === 'APPROVE' ? 'Disetujui oleh saksi' : 'Ditolak oleh saksi'),
            },
        });
    }
    async getAdminCorrections() {
        return this.prisma.attendanceCorrection.findMany({
            include: {
                user: {
                    select: { id: true, name: true, nip: true, position: true },
                },
                witness: {
                    select: { id: true, name: true, position: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async adminApprove(correctionId, action, notes) {
        const correction = await this.prisma.attendanceCorrection.findUnique({
            where: { id: correctionId },
        });
        if (!correction) {
            throw new common_1.NotFoundException('Data permohonan koreksi tidak ditemukan');
        }
        const nextStatus = action === 'APPROVE'
            ? client_1.CorrectionStatus.APPROVED
            : client_1.CorrectionStatus.REJECTED;
        if (action === 'APPROVE') {
            const dateOnly = new Date(correction.date);
            dateOnly.setHours(0, 0, 0, 0);
            const existingAttendance = await this.prisma.attendance.findUnique({
                where: {
                    userId_date: {
                        userId: correction.userId,
                        date: dateOnly,
                    },
                },
            });
            const checkInSimulated = new Date(dateOnly);
            checkInSimulated.setHours(8, 0, 0, 0);
            const checkOutSimulated = new Date(dateOnly);
            checkOutSimulated.setHours(16, 0, 0, 0);
            if (existingAttendance) {
                await this.prisma.attendance.update({
                    where: { id: existingAttendance.id },
                    data: {
                        checkInTime: correction.correctionType === client_1.CorrectionType.CHECK_IN ? checkInSimulated : existingAttendance.checkInTime,
                        checkOutTime: correction.correctionType === client_1.CorrectionType.CHECK_OUT ? checkOutSimulated : existingAttendance.checkOutTime,
                        status: client_1.AttendanceStatus.HADIR,
                    },
                });
            }
            else {
                await this.prisma.attendance.create({
                    data: {
                        userId: correction.userId,
                        date: dateOnly,
                        checkInTime: correction.correctionType === client_1.CorrectionType.CHECK_IN ? checkInSimulated : null,
                        checkOutTime: correction.correctionType === client_1.CorrectionType.CHECK_OUT ? checkOutSimulated : null,
                        status: client_1.AttendanceStatus.HADIR,
                    },
                });
            }
        }
        return this.prisma.attendanceCorrection.update({
            where: { id: correctionId },
            data: {
                status: nextStatus,
                reviewNotes: notes || (action === 'APPROVE' ? 'Disetujui oleh admin' : 'Ditolak oleh admin'),
            },
        });
    }
};
exports.CorrectionService = CorrectionService;
exports.CorrectionService = CorrectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CorrectionService);
//# sourceMappingURL=correction.service.js.map