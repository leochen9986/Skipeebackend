import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserRequests, UserRequestsSchema } from './schemas/user-request';
import { EmailModule } from 'src/email/email.module';
import { Site, SiteSchema } from '../sites/schemas/sites.schema'; // Adjust the path as necessary


@Module({
  imports: [
    EmailModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserRequests.name, schema: UserRequestsSchema},
      { name: Site.name, schema: SiteSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
