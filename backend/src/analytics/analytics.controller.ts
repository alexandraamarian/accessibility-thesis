import { Controller, Get, Param, Query, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get session analytics with events and adaptations' })
  getSessionAnalytics(@Param('id') id: string) {
    return this.analyticsService.getSessionAnalytics(id);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get aggregate summary statistics' })
  getSummaryStatistics() {
    return this.analyticsService.getSummaryStatistics();
  }

  @Get('export')
  @ApiOperation({ summary: 'Export study data as CSV for R/SPSS analysis' })
  @ApiQuery({ name: 'participantIds', required: false, type: String, description: 'Comma-separated participant IDs' })
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="study_data.csv"')
  async exportCSV(@Query('participantIds') participantIds?: string) {
    const ids = participantIds ? participantIds.split(',') : undefined;
    return this.analyticsService.exportCSV(ids);
  }
}
