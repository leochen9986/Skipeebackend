import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type EventTicketsDocument = HydratedDocument<EventTicket>;

export enum ticketType {
    QUEUESKIP = 'queue',
    ENTRYTICKET = 'entry',
}



@Schema({ timestamps: true })
export class EventTicket {

  @ApiProperty({example: 'General Ticket', description: 'Name of the ticket'})
  @Prop({ required: true })
  name: string;

  @ApiProperty({example: '10', description: 'Total quantity of ticket'})
  @Prop({required: true})
  totalQuantity: string;

  @ApiProperty({example: '10', description: 'Available quantity of ticket'})
  @Prop({required: true})
  availableQuantity: string;

  @ApiProperty({example: '10', description: 'Price of ticket'})
  @Prop({required: true})
  price: string;

  @ApiProperty({example: 'queue', description: 'Type of ticket'})
  @Prop({required: true})
  type: ticketType;

  @ApiProperty({ description: 'Event of ticket'})
  @Prop({required: true, type: Types.ObjectId, ref: 'Event'})
  event: Types.ObjectId;

  @ApiProperty({ description: 'Site of ticket'})
  @Prop({required: true, type: Types.ObjectId, ref: 'Site'})
  site: Types.ObjectId;

  @ApiProperty({ description: 'Sale Start time of ticket'})
  @Prop({required: true})
  saleStartTime: Date;

  @ApiProperty({ description: 'Sale End time of ticket'})
  @Prop({required: true})
  saleEndTime: Date;
}

export const EventTicketSchema = SchemaFactory.createForClass(EventTicket);
