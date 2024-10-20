import { Module } from '@nestjs/common';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './schemas/sites.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { EventTicket, EventTicketSchema } from './schemas/event-ticket.schema';
import { Event, EventSchema } from './schemas/event.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Site.name, schema: SiteSchema },
      { name: Event.name, schema: EventSchema },
      { name: EventTicket.name, schema: EventTicketSchema},
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [SitesController],
  providers: [SitesService],
})
export class SitesModule {}
