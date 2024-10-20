import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Site, SiteSchema } from 'src/sites/schemas/sites.schema';
import { Ticket, TicketSchema } from 'src/tickets/schemas/tickets.schema';
import { EventSchema } from 'src/sites/schemas/event.schema';
import { EventTicket, EventTicketSchema } from 'src/sites/schemas/event-ticket.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }]),
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: EventTicket.name, schema: EventTicketSchema }]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
