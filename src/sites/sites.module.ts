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
import { forwardRef } from '@nestjs/common';
@Module({
  imports: [
    forwardRef(() => AuthModule), 
    MongooseModule.forFeature([
      { name: Site.name, schema: SiteSchema },
      { name: Event.name, schema: EventSchema },
      { name: EventTicket.name, schema: EventTicketSchema},
      { name: User.name, schema: UserSchema },
    ]),
    UsersModule,
  ],
  controllers: [SitesController],
  providers: [SitesService],
  exports: [SitesService], // Add this line
})
export class SitesModule {}