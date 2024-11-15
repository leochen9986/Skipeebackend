import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSiteDto } from './create-site.dto';

export class UpdateSiteDto extends PartialType(CreateSiteDto) {
  // All fields are optional in PartialType
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ required: false })
  logo?: string;

  // Add any other fields that can be updated
}
