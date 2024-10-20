import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    example: 'Example Venue',
    description: 'The name of the venue',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'A beautiful venue for events and gatherings',
    description: 'A brief description of the venue',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 'https://example.com/venue.jpg',
    description: 'URL of the venue image',
  })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'The date and time of the event',
  })
  @IsOptional()
  date: Date;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'The start time of the event',
  })
  @IsOptional()
  startTime: Date;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'The end time of the event',
  })
  @IsOptional()
  endTime: Date;

  @ApiProperty({
    example: 'Example Location',
    description: 'The location of the event',
  })
  @IsOptional()
  location: string;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'The last entry time of the event',
  })
  @IsOptional()
  lastEntryTime: Date;

  @ApiProperty({
    example: 18,
    description: 'The minimum age limit of the event',
  })
  @IsOptional()
  minAgeLimit: number;

}
