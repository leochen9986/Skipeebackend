import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type EventDocument = Event & Document;

export enum eventStatus {
  DRAFT = 'draft',
  UPCOMING = 'upcoming',
  CURRENT = 'current',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Event {
  @ApiProperty({ description: 'The name of the event' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'The description of the event' })
  @Prop({ required: false })
  description: string;

  @ApiProperty({ description: 'The image of the event' })
  @Prop({ required: false })
  image: string;

  @ApiProperty({ description: 'The date of the event' })
  @Prop({ required: false })
  date: Date;

  @ApiProperty({ description: 'The end date of the event' })
  @Prop({ required: false })
  endDate: Date;

  @ApiProperty({ description: 'The start time of the event' })
  @Prop({ required: false })
  startTime: string;

  @ApiProperty({ description: 'The end time of the event' })
  @Prop({ required: false })
  endTime: string;

  @ApiProperty({ description: 'The location of the event' })
  @Prop({ required: false })
  location: string;

  @ApiProperty({ description: 'The site of the event' })
  @Prop({ type: Types.ObjectId, ref: 'Site', required: true })
  site: Types.ObjectId;

  @ApiProperty({ description: 'The last entry time of the event' })
  @Prop({ required: false })
  lastEntryTime: string;

  @ApiProperty({ description: 'The minimum age limit for the event' })
  @Prop({ required: false })
  minAgeLimit: number;

  @ApiProperty({ description: 'The array of tickets available for the event' })
  @Prop({ type: [Types.ObjectId], ref: 'EventTicket', default: [] })
  tickets: Types.ObjectId[];

  @ApiProperty({ description: 'The owner of the event' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @ApiProperty({ description: 'The status of the event' })
  @Prop({ enum: eventStatus, default: eventStatus.DRAFT })
  status: eventStatus;
}

export const EventSchema = SchemaFactory.createForClass(Event);
