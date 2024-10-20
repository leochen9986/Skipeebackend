// reports.controller.ts
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { UserSecure } from 'src/auth/decorator/secure.decorator';
import { ReportsService } from './reports.service';
import { CreateIncidentReportDTO } from './dto/create-incident-report.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('reports')
@ApiBearerAuth()
@UserSecure()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @Public()
  @ApiQuery({ name: 'siteId', required: false })
  async getAllIncidents(@Query('siteId') siteId?: string) {
    return this.reportsService.getAllIncidents(siteId);
  }

  @Get(':id')
  @Public()
  async getIncidentById(@Param('id') id: string) {
    return this.reportsService.getIncidentById(id);
  }

  @Post()
  @Public()
  async createIncident(@Body() createIncidentReportDTO: CreateIncidentReportDTO) {
    return this.reportsService.createIncident(createIncidentReportDTO);
  }
}