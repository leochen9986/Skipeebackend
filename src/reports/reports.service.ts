import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IncidentReport, IncidentReportDocument } from './schema/report.schema';
import { CreateIncidentReportDTO } from './dto/create-incident-report.dto';
import { Model } from 'mongoose';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(IncidentReport.name)
    private readonly incidentReportModel: Model<IncidentReportDocument>,
  ) {}

  async getAllIncidents(siteId?: string): Promise<IncidentReportDocument[]> {
    let query = this.incidentReportModel.find().sort({ createdAt: -1 }).populate('site').populate('reportedBy');
    if (siteId) {
      query = query.where('site', siteId);
    }
    return query.exec();
  }

  async getIncidentById(id: string): Promise<IncidentReportDocument> {
    return this.incidentReportModel.findById(id).exec();
  }

  async createIncident(
    createIncidentReportDTO: CreateIncidentReportDTO,
  ): Promise<IncidentReportDocument> {
    const createdIncidentReport = new this.incidentReportModel(
      createIncidentReportDTO,
    );
    return createdIncidentReport.save();
  }
}