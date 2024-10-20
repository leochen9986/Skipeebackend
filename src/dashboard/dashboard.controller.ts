import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { UserSecure } from 'src/auth/decorator/secure.decorator';
import { FUser } from 'src/auth/decorator/user.decorator';
import { ApiBearerAuth, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilterDto } from './dto/filter.dto';

@Controller('dashboard')
@ApiTags('Dashboard')
@ApiBearerAuth()
@UserSecure()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiProperty({ name: 'siteId', required: false })
  getDashboardData(@FUser() user: any, @Query() dateRange: FilterDto) {
    return this.dashboardService.getDashboardData(
      user,
      dateRange.startDate,
      dateRange.endDate,
      dateRange.siteId,
    );
  }
}
