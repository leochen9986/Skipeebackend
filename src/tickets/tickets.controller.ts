import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { TicketsServices } from './tickets.services';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { UserSecure } from 'src/auth/decorator/secure.decorator';
import { FUser } from 'src/auth/decorator/user.decorator';
@Controller('tickets')
@ApiTags('Tickets')
@Public()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsServices) {}

  @Get()
  @UserSecure()
  @ApiBearerAuth()
  getTickets(@FUser() user) {
    return this.ticketsService.getAllTickets(user);
  }

  @Get('/:id')
  getTicket(@Param('id') id: string) {
    return this.ticketsService.getTickets(id);
  }

  @Get('/tickets-type/:id')
  getTicketFromticketsType(@Param('id') id: string) {
    return this.ticketsService.getTicketFromticketsType(id);
  }

  @Get('/approve/:id/:quantiy')
  approveTicket(@Param('id') id: string, @Param('quantiy') quantity: number) {
    return this.ticketsService.approveTicket(id, quantity);
  }

  @Get('/confirm/:id')
  confirmTicket(@Param('id') id: string) {
    return this.ticketsService.confirmTicket(id);
  }
  


  @Post()
  createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.createTicket(createTicketDto);
  }
}
