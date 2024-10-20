import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  isActive: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  gender: string;

  @ApiProperty({ required: false })
  @IsOptional()
  birthDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  worksIn: string;
}
