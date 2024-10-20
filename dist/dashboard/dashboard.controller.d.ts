import { DashboardService } from './dashboard.service';
import { FilterDto } from './dto/filter.dto';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboardData(user: any, dateRange: FilterDto): Promise<{
        ticketCount: number;
        totalAmount: any;
        chartData: any[];
        topCustomers: any[];
    }>;
}
