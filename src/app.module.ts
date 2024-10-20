import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ValidateUserMiddleware } from './auth/middleware/validate-user.middleware';
import { AuthService } from './auth/auth.service';
import { TicketsModule } from './tickets/tickets.module';
import { User, UserSchema } from './users/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { SitesModule } from './sites/sites.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { EmailModule } from './email/email.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    AuthModule,
    SitesModule,
    TicketsModule,
    DashboardModule,
    ReportsModule,
    EmailModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(ValidateUserMiddleware).forRoutes('*');
  }
}
