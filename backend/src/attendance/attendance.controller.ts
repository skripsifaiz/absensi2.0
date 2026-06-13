import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('today')
  async getTodayStatus(@Query('userId') userId: string) {
    return this.attendanceService.getTodayStatus(userId);
  }

  @Post('check-in')
  async checkIn(@Body() body: any) {
    return this.attendanceService.checkIn(body.userId, body.latitude, body.longitude);
  }

  @Post('check-out')
  async checkOut(@Body() body: any) {
    return this.attendanceService.checkOut(body.userId, body.latitude, body.longitude);
  }

  @Get('history')
  async getHistory(
    @Query('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
  ) {
    return this.attendanceService.getHistory(userId, startDate, endDate, status);
  }

  @Get('stats')
  async getStats(@Query('userId') userId: string) {
    return this.attendanceService.getStats(userId);
  }

  @Get('admin/stats')
  async getAdminStats() {
    return this.attendanceService.getAdminStats();
  }

  @Get('admin/dashboard')
  async getAdminDashboard() {
    return this.attendanceService.getAdminDashboardSummary();
  }
}
