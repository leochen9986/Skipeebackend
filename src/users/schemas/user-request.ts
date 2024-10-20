import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersRequestsDocument = HydratedDocument<UserRequests>;

@Schema({ timestamps: true })
export class UserRequests {
  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  organizerName: string;

  @Prop({ required: true, default: false })
  approved: boolean;
}

export const UserRequestsSchema = SchemaFactory.createForClass(UserRequests);
