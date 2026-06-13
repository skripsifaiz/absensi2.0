import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const config = await this.prisma.schoolConfig.findFirst();
    if (!config) {
      throw new NotFoundException('School configuration not found');
    }
    return config;
  }

  async updateSettings(data: any) {
    const config = await this.prisma.schoolConfig.findFirst();
    if (!config) {
      // Create new if none exists
      return this.prisma.schoolConfig.create({
        data: {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          radius: parseInt(data.radius),
          startTime: data.startTime,
          endTime: data.endTime,
          lateThreshold: parseInt(data.lateThreshold),
          geofenceActive: data.geofenceActive ?? true,
          schoolName: data.schoolName,
          contactEmail: data.contactEmail,
        },
      });
    }

    return this.prisma.schoolConfig.update({
      where: { id: config.id },
      data: {
        latitude: data.latitude !== undefined ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude !== undefined ? parseFloat(data.longitude) : undefined,
        radius: data.radius !== undefined ? parseInt(data.radius) : undefined,
        startTime: data.startTime,
        endTime: data.endTime,
        lateThreshold: data.lateThreshold !== undefined ? parseInt(data.lateThreshold) : undefined,
        geofenceActive: data.geofenceActive,
        schoolName: data.schoolName,
        contactEmail: data.contactEmail,
      },
    });
  }
}
