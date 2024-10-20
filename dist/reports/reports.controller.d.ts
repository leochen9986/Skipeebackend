import { ReportsService } from './reports.service';
import { CreateIncidentReportDTO } from './dto/create-incident-report.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getAllIncidents(siteId?: string): Promise<import("src/reports/schema/report.schema").IncidentReportDocument[]>;
    getIncidentById(id: string): Promise<import("src/reports/schema/report.schema").IncidentReportDocument>;
    createIncident(createIncidentReportDTO: CreateIncidentReportDTO): Promise<import("src/reports/schema/report.schema").IncidentReportDocument>;
}
