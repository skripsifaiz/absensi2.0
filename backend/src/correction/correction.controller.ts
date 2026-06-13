import { Controller, Post, Get, Patch, Body, Query, Param } from '@nestjs/common';
import { CorrectionService } from './correction.service';

@Controller('correction')
export class CorrectionController {
  constructor(private readonly correctionService: CorrectionService) {}

  @Post()
  async submitCorrection(@Body() body: any) {
    return this.correctionService.submitCorrection(body);
  }

  @Get('pending-witness')
  async getPendingWitnessCorrections(@Query('witnessId') witnessId: string) {
    return this.correctionService.getPendingWitnessCorrections(witnessId);
  }

  @Patch(':id/witness-approve')
  async witnessApprove(
    @Param('id') id: string,
    @Body('action') action: 'APPROVE' | 'REJECT',
    @Body('notes') notes?: string,
  ) {
    return this.correctionService.witnessApprove(id, action, notes);
  }

  @Get('admin')
  async getAdminCorrections() {
    return this.correctionService.getAdminCorrections();
  }

  @Patch(':id/admin-approve')
  async adminApprove(
    @Param('id') id: string,
    @Body('action') action: 'APPROVE' | 'REJECT',
    @Body('notes') notes?: string,
  ) {
    return this.correctionService.adminApprove(id, action, notes);
  }
}
