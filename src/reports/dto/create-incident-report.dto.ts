import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIncidentReportDTO {
  @ApiProperty({ description: 'The ID of the user who reported the incident' })
  @IsMongoId()
  @IsNotEmpty()
  reportedBy: string;

  @ApiProperty({ description: 'The date and time of the incident' })
  @IsDateString()
  @IsNotEmpty()
  incidentDate: string;

  @ApiProperty({ description: 'A description of the incident' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Site of incident' })
  @IsMongoId()
  @IsNotEmpty()
  site: string;

  @ApiProperty({ description: 'The investigation notes' })
  @IsString()
  @IsOptional()
  investigationNotes?: string;
}