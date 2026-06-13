import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { CorrectionStatus, VerificationMethod, CorrectionType, AttendanceStatus } from '@prisma/client';

@Injectable()
export class CorrectionService {
  constructor(private prisma: PrismaService) {}

  async submitCorrection(data: {
    userId: string;
    date: string;
    correctionType: string;
    reason: string;
    verificationMethod: string;
    witnessId?: string;
    photoUrl?: string;
  }) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });
    if (!userExists) {
      throw new NotFoundException('Staf/Guru tidak ditemukan.');
    }

    const correctionDate = new Date(data.date);
    correctionDate.setHours(0, 0, 0, 0);

    const type = data.correctionType === 'Check-In' ? CorrectionType.CHECK_IN : CorrectionType.CHECK_OUT;
    const method = data.verificationMethod === 'witness' ? VerificationMethod.WITNESS : VerificationMethod.PHOTO;

    // Default status depending on verification method
    const status = method === VerificationMethod.WITNESS
      ? CorrectionStatus.PENDING_WITNESS
      : CorrectionStatus.PENDING_ADMIN;

    return this.prisma.attendanceCorrection.create({
      data: {
        userId: data.userId,
        date: correctionDate,
        correctionType: type,
        reason: data.reason,
        verificationMethod: method,
        witnessId: method === VerificationMethod.WITNESS ? data.witnessId : null,
        photoUrl: method === VerificationMethod.PHOTO ? data.photoUrl : null,
        status,
      },
    });
  }

  async getPendingWitnessCorrections(witnessId: string) {
    return this.prisma.attendanceCorrection.findMany({
      where: {
        witnessId,
        status: CorrectionStatus.PENDING_WITNESS,
      },
      include: {
        user: {
          select: { id: true, name: true, nip: true, position: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async witnessApprove(correctionId: string, action: 'APPROVE' | 'REJECT', notes?: string) {
    const correction = await this.prisma.attendanceCorrection.findUnique({
      where: { id: correctionId },
    });

    if (!correction) {
      throw new NotFoundException('Data permohonan koreksi tidak ditemukan');
    }

    if (correction.status !== CorrectionStatus.PENDING_WITNESS) {
      throw new BadRequestException('Permohonan tidak dalam status menunggu persetujuan saksi');
    }

    const nextStatus = action === 'APPROVE'
      ? CorrectionStatus.PENDING_ADMIN // Forward to admin
      : CorrectionStatus.WITNESS_REJECTED; // Rejected by witness

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

  async adminApprove(correctionId: string, action: 'APPROVE' | 'REJECT', notes?: string) {
    const correction = await this.prisma.attendanceCorrection.findUnique({
      where: { id: correctionId },
    });

    if (!correction) {
      throw new NotFoundException('Data permohonan koreksi tidak ditemukan');
    }

    const nextStatus = action === 'APPROVE'
      ? CorrectionStatus.APPROVED
      : CorrectionStatus.REJECTED;

    // If approved, update/upsert the attendance record
    if (action === 'APPROVE') {
      const dateOnly = new Date(correction.date);
      dateOnly.setHours(0, 0, 0, 0);

      // Find if attendance exists
      const existingAttendance = await this.prisma.attendance.findUnique({
        where: {
          userId_date: {
            userId: correction.userId,
            date: dateOnly,
          },
        },
      });

      // Create simulated check-in/out timestamps on the target date
      const checkInSimulated = new Date(dateOnly);
      checkInSimulated.setHours(8, 0, 0, 0); // 08:00 AM

      const checkOutSimulated = new Date(dateOnly);
      checkOutSimulated.setHours(16, 0, 0, 0); // 04:00 PM

      if (existingAttendance) {
        await this.prisma.attendance.update({
          where: { id: existingAttendance.id },
          data: {
            checkInTime: correction.correctionType === CorrectionType.CHECK_IN ? checkInSimulated : existingAttendance.checkInTime,
            checkOutTime: correction.correctionType === CorrectionType.CHECK_OUT ? checkOutSimulated : existingAttendance.checkOutTime,
            status: AttendanceStatus.HADIR, // Reset to HADIR upon approved correction
          },
        });
      } else {
        await this.prisma.attendance.create({
          data: {
            userId: correction.userId,
            date: dateOnly,
            checkInTime: correction.correctionType === CorrectionType.CHECK_IN ? checkInSimulated : null,
            checkOutTime: correction.correctionType === CorrectionType.CHECK_OUT ? checkOutSimulated : null,
            status: AttendanceStatus.HADIR,
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
}
