import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SiteDocument = Site & Document;

enum Gender {
  Male = 'male',
  Female = 'female',
}

@Schema({ timestamps: true })
export class Site {
  @ApiProperty({ description: 'The name of the Organization' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Email of the Organization' })
  @Prop({ required: true })
  email: string;

  @Prop({ default: false })  // Default value can be false if you want
  skipping: boolean;

  @Prop({ default: false })  // Default value can be false if you want
  ticketing: boolean;

  @ApiProperty({ description: 'Contact number of the Organization' })
  @Prop({ required: true })
  phone: string;

  @Prop({ default: false })  // Add archived field with a default value of false
  archived: boolean;

  @ApiProperty({ description: 'The logo of the organization' })
  @Prop({ required: true })
  logo: string;

  @ApiProperty({ description: 'Owner of the venue' })
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId;

  @ApiProperty({ description: 'Location of the site' })
  @Prop({ required: true })
  location: string;

  
  @ApiProperty({ description: 'Approved' })
  @Prop({ default: true })
  approved: boolean;

  @ApiProperty({ description: 'Stripe account id' })
  @Prop({ required: false, default: null })
  stripeAccountId: string;

  @ApiProperty({ description: 'Minimum commission amount' })
  @Prop({ required: true, default: 0 })
  minCommission: number;

  @ApiProperty({ description: 'Maximum commission amount' })
  @Prop({ required: true, default: 100 })
  maxCommission: number;

  @ApiProperty({ description: 'Percentage commission' })
  @Prop({ required: true, default: 0 })
  percentageCommission: number;

  @ApiProperty({ description: 'Base commission amount' })
  @Prop({ required: true, default: 0 })
  baseCommission: number;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
