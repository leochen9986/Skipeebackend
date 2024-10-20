import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type IncidentReportDocument = IncidentReport & Document;

@Schema({ timestamps: true })
export class IncidentReport {
  @ApiProperty({ description: 'The ID of the user who reported the incident' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reportedBy: Types.ObjectId;

  @ApiProperty({ description: 'The date and time of the incident' })
  @Prop({ type: Date, required: true })
  incidentDate: Date;

  @ApiProperty({ description: 'A description of the incident' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ description: 'Site of incident'})
  @Prop({required: true, type: Types.ObjectId, ref: 'Site'})
  site: Types.ObjectId;

  @ApiProperty({ description: 'The investigation notes' })
  @Prop()
  investigationNotes: string;
}

export const IncidentReportSchema = SchemaFactory.createForClass(IncidentReport);