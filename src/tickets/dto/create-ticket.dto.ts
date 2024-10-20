import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  phone: string;

  @ApiProperty({ required: false })
  eventTicket: string;

  @ApiProperty({ required: true })
  noOfUser: number;
}
