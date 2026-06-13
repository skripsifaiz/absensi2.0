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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../infrastructure/prisma/prisma.service");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async login(nip, password) {
        const user = await this.prisma.user.findUnique({
            where: { nip },
        });
        if (!user || user.password !== password) {
            throw new common_1.UnauthorizedException('NIP atau Password salah');
        }
        if (user.status !== 'ACTIVE') {
            throw new common_1.UnauthorizedException('Akun Anda dinonaktifkan');
        }
        return {
            id: user.id,
            nip: user.nip,
            email: user.email,
            name: user.name,
            role: user.role,
            position: user.position,
            phone: user.phone,
        };
    }
    async registerTeacher(data) {
        const existingNip = await this.prisma.user.findUnique({
            where: { nip: data.nip },
        });
        if (existingNip) {
            throw new common_1.ConflictException('NIP sudah terdaftar');
        }
        const existingEmail = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Email sudah terdaftar');
        }
        return this.prisma.user.create({
            data: {
                ...data,
                role: client_1.Role.TEACHER,
                status: 'ACTIVE',
            },
            select: {
                id: true,
                nip: true,
                email: true,
                name: true,
                position: true,
                role: true,
            },
        });
    }
    async getTeachers() {
        return this.prisma.user.findMany({
            where: {
                role: client_1.Role.TEACHER,
                status: 'ACTIVE',
            },
            select: {
                id: true,
                nip: true,
                email: true,
                name: true,
                position: true,
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map