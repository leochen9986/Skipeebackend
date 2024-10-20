import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSiteDto {
  @ApiProperty({
    example: 'Example Venue',
    description: 'The name of the venue',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'https://example.com/venue.jpg',
    description: 'URL of the venue image',
  })
  @IsNotEmpty()
  @IsString()
  logo: string;

  @ApiProperty({
    example: 'manager@example.com',
    description: 'Email address of the orgnization',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Phone number of the venue',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;
}


