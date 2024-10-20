import { ApiProperty } from '@nestjs/swagger';

export class FilterDto {
  @ApiProperty({ required: false })
  startDate?: string;

  @ApiProperty({ required: false })
  endDate?: string;

  @ApiProperty({ required: false })
  siteId?: string;
}
