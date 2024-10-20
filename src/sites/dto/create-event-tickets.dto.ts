import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateEventTicketDto {
    @ApiProperty({ description: 'Name of the ticket', example: 'General Queue' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Total quantity of the ticket', example: '10' })
    @IsNumber()
    totalQuantity: number;

    @ApiProperty({ description: 'Price of the ticket', example: '10' })
    @IsNumber()
    price: string;

    @ApiProperty({ description: 'Type of the ticket', example: 'queue' })
    @IsString()
    type: string;

    @ApiProperty({ description: 'Sale start time', example: '2022-01-01 00:00:00' })
    @IsString()
    saleStartTime: string;

    @ApiProperty({ description: 'Sale end time', example: '2022-01-01 00:00:00' })
    @IsString()
    saleEndTime: string;  
}

