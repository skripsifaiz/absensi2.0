import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  private getTodayDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  async getTodayStatus(userId: string) {
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

  async checkIn(userId: string, lat?: number, lng?: number) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new NotFoundException('Staf/Guru tidak ditemukan.');
    }

    const today = this.getTodayDate();

    // Check if check-in already exists
    const existing = await this.prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    if (existing && existing.checkInTime) {
      throw new ConflictException('Anda sudah melakukan Check-In hari ini.');
    }

    // Get school config for rules
    const config = await this.prisma.schoolConfig.findFirst();
    let status: AttendanceStatus = AttendanceStatus.HADIR;

    if (config) {
      const now = new Date();
      const [startHour, startMinute] = config.startTime.split(':').map(Number);
      const startCompare = new Date(now);
      startCompare.setHours(startHour, startMinute, 0, 0);

      const lateThresholdMs = config.lateThreshold * 60 * 1000;
      const limitTime = new Date(startCompare.getTime() + lateThresholdMs);

      if (now > limitTime) {
        status = AttendanceStatus.TERLAMBAT;
      }
    }

    if (existing) {
      // If record exists (e.g. created by admin as leave/izin/absent), update it
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

  async checkOut(userId: string, lat?: number, lng?: number) {
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
      throw new NotFoundException('Harap lakukan Check-In terlebih dahulu.');
    }

    if (existing.checkOutTime) {
      throw new ConflictException('Anda sudah melakukan Check-Out hari ini.');
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

  async getHistory(userId: string, startDate?: string, endDate?: string, status?: string) {
    const whereClause: any = { userId };

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
      // Map Indonesian statuses to enum values
      let mappedStatus: AttendanceStatus | undefined = undefined;
      if (status === 'Hadir') mappedStatus = AttendanceStatus.HADIR;
      else if (status === 'Terlambat') mappedStatus = AttendanceStatus.TERLAMBAT;
      else if (status === 'Alpa') mappedStatus = AttendanceStatus.ALPA;
      else if (status === 'Izin') mappedStatus = AttendanceStatus.IZIN;


      if (mappedStatus) {
        whereClause.status = mappedStatus;
      }
    }

    return this.prisma.attendance.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    });
  }

  async getStats(userId: string) {
    // Basic stats for teacher dashboard
    const records = await this.prisma.attendance.findMany({
      where: { userId },
    });

    const total = records.length;
    const present = records.filter(r => r.status === AttendanceStatus.HADIR).length;
    const late = records.filter(r => r.status === AttendanceStatus.TERLAMBAT).length;
    const izin = records.filter(r => r.status === AttendanceStatus.IZIN).length;
    const alpa = records.filter(r => r.status === AttendanceStatus.ALPA).length;

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

    // Today's stats
    const todayRecords = await this.prisma.attendance.findMany({
      where: { date: today },
      include: { user: true },
    });

    const present = todayRecords.filter(r => r.status === AttendanceStatus.HADIR).length;
    const late = todayRecords.filter(r => r.status === AttendanceStatus.TERLAMBAT).length;
    const alpa = todayRecords.filter(r => r.status === AttendanceStatus.ALPA).length;
    const totalTeachers = await this.prisma.user.count({ where: { role: 'TEACHER' } });

    // Recent corrections
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
    
    // Get recent check-ins
    const recentAttendances = await this.prisma.attendance.findMany({
      take: 5,
      orderBy: { checkInTime: 'desc' },
      include: {
        user: {
          select: { name: true, nip: true, position: true }
        }
      }
    });

    // Get stats
    const stats = await this.getAdminStats();

    return {
      stats,
      recentAttendances,
    };
  }
}
