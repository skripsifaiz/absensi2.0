import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body.nip, body.password);
  }

  @Post('register-teacher')
  async registerTeacher(@Body() body: any) {
    return this.authService.registerTeacher({
      nip: body.nip,
      email: body.email,
      name: body.name,
      password: body.password || 'teacher123', // default password
      phone: body.phone,
      position: body.position,
    });
  }

  @Get('teachers')
  async getTeachers() {
    return this.authService.getTeachers();
  }
}
