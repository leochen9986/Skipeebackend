import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRoles } from './user.schema'; // Ensure this import is correct

export type UsersRequestsDocument = HydratedDocument<UserRequests>;

@Schema({ timestamps: true })
export class UserRequests {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: true })
  organizerName: string;

  @Prop({ required: true })
  role: UserRoles;

  @Prop({ required: true, default: false })
  approved: boolean;
}

export const UserRequestsSchema = SchemaFactory.createForClass(UserRequests);
