import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsServices } from './tickets.services';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './schemas/tickets.schema';
import {
  EventTicket,
  EventTicketSchema,
} from 'src/sites/schemas/event-ticket.schema';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    EmailModule,
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
      { name: EventTicket.name, schema: EventTicketSchema },
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketsServices],
})
export class TicketsModule {}
