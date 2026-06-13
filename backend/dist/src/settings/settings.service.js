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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../infrastructure/prisma/prisma.service");
let SettingsService = class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        const config = await this.prisma.schoolConfig.findFirst();
        if (!config) {
            throw new common_1.NotFoundException('School configuration not found');
        }
        return config;
    }
    async updateSettings(data) {
        const config = await this.prisma.schoolConfig.findFirst();
        if (!config) {
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
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map