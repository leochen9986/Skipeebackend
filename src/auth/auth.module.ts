import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/email/email.module';
import { SitesModule } from 'src/sites/sites.module'; // Import SitesModule
import { forwardRef } from '@nestjs/common';
@Global()
@Module({
  imports: [
    forwardRef(() => SitesModule),
    JwtModule,
    UsersModule,
    EmailModule,

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
