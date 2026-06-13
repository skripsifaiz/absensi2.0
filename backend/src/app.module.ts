import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { AttendanceModule } from './attendance/attendance.module';
import { CorrectionModule } from './correction/correction.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    SettingsModule,
    AttendanceModule,
    CorrectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

