import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AnalyticsRepository } from './analytics.repository';

@Controller('analytics')
@UseGuards(AuthenticationGuard)
export class AnalyticsController {
  constructor(private analyticsRepository: AnalyticsRepository) {}

  @Post('/subcategory')
  setSubcategoryAnalytics(@Body() body: any, @Req() req: any) {
    this.analyticsRepository.setSubcategoryAnalytics(req.user.id, body.id);
  }
}
