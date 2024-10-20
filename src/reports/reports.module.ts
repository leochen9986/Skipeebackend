import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentReport, IncidentReportSchema } from './schema/report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: IncidentReport.name, schema: IncidentReportSchema }]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
