import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(nip: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { nip },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('NIP atau Password salah');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Akun Anda dinonaktifkan');
    }

    // Return profile details
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

  async registerTeacher(data: {
    nip: string;
    email: string;
    name: string;
    password: string;
    phone?: string;
    position?: string;
  }) {
    // Check if NIP exists
    const existingNip = await this.prisma.user.findUnique({
      where: { nip: data.nip },
    });
    if (existingNip) {
      throw new ConflictException('NIP sudah terdaftar');
    }

    // Check if email exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email sudah terdaftar');
    }

    return this.prisma.user.create({
      data: {
        ...data,
        role: Role.TEACHER,
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
        role: Role.TEACHER,
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
}
