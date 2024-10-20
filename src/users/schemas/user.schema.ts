import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UsersDocument = HydratedDocument<User>;

export enum UserRoles {
  Admin = 'admin',
  Manager = 'manager',
  Employee = 'employee',
  User = 'user',
}

enum Gender {
  Male = 'male',
  Female = 'female',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: UserRoles;

  @Prop({ required: false, default: true })
  isActive: boolean;

  @Prop({ required: false, default: Date.now() })
  lastSeen: Date;

  @Prop({ required: false, default: Gender.Male })
  gender: Gender;

  @Prop({ required: false })
  birthDate: Date;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Site' })
  worksIn: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
