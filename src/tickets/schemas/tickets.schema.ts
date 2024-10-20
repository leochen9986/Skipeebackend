import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TicketsDocument = HydratedDocument<Ticket>;

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'EventTicket', required: false })
  eventTicket: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Event' })
  event: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Site' })
  site: Types.ObjectId;

  @Prop({ required: true })
  noOfUser: number;

  @Prop({ default: false })
  isScaned: boolean;

  @Prop({ default: false })
  isConfirmed: boolean;

  @Prop({ default: 0 })
  entered: number;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
