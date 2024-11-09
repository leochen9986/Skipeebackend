import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Ticket } from './schemas/tickets.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTicketDto } from './dto/create-ticket.dto';
import Stripe from 'stripe';
import { EventTicket } from 'src/sites/schemas/event-ticket.schema';
import { Site } from 'src/sites/schemas/sites.schema';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class TicketsServices {
  stripe: Stripe;
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
    @InjectModel(EventTicket.name)
    private readonly eventTicketModel: Model<EventTicket>,
    private readonly emailService: EmailService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  async createTicket(ticket: CreateTicketDto) {
    const eventTicket = await this.eventTicketModel.findById(ticket.eventTicket);
    if (!eventTicket) {
      throw new HttpException('Event ticket not found', HttpStatus.NOT_FOUND);
    }
    const availableTicketQuantity = parseInt(eventTicket.availableQuantity);
    if (availableTicketQuantity < ticket.noOfUser) {
      throw new HttpException('Not enough tickets available', HttpStatus.NOT_FOUND);
    }
    const createdTicket = new this.ticketModel({
      ...ticket,
      site: eventTicket.site,
      event: eventTicket.event,
      amount: parseFloat(eventTicket.price) * ticket.noOfUser,
      isConfirmed: false, // Set to false initially
    });
    const result = await createdTicket.save();
    if (!result) {
      throw new HttpException('Failed to create ticket', HttpStatus.NOT_FOUND);
    }
    return await this.createCheckoutSession(
      result._id.toString(),
      '104.248.165.72:3000',
    );
  }

  async approveTicket(id: string, quantity: number) {
    const ticket = await this.ticketModel.findById(id);
    const remaining_ticket = ticket.noOfUser - ticket.entered;
    const toenter =
      parseInt(quantity.toString()) + parseInt(ticket.entered.toString());

    if (!ticket.isConfirmed) {
      throw new HttpException('Failed to approve ticket', HttpStatus.NOT_FOUND);
    }

    if (quantity > remaining_ticket) {
      throw new HttpException(
        'Ticket is only remaining for ' + remaining_ticket + ' users',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.ticketModel
      .findByIdAndUpdate(
        id,
        { isScaned: true, entered: toenter },
        {
          new: true,
        },
      )
      .populate({
        path: 'eventTicket',
        populate: [{ path: 'site' }, { path: 'event' }],
      });
    if (!result) {
      throw new HttpException('Failed to approve ticket', HttpStatus.NOT_FOUND);
    }
    return result;
  }

// tickets.services.ts

async confirmTicket(id: string) {
  const ticket = await this.ticketModel.findById(id);
  if (!ticket) {
    throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
  }
  if (ticket.isConfirmed) {
    // Ticket is already confirmed
    return ticket;
  }
  const session = await this.stripe.checkout.sessions.retrieve(ticket.stripeSessionId);
  if (session.payment_status === 'paid') {
    // Payment successful, confirm the ticket
    const result = await this.ticketModel.findByIdAndUpdate(id, {
      isConfirmed: true,
    }, { new: true });
    if (!result) {
      throw new HttpException('Failed to confirm ticket', HttpStatus.NOT_FOUND);
    }
    const eventTicket = await this.eventTicketModel
      .findById(result.eventTicket.toString())
      .populate('site')
      .populate('event');
    // Decrement the available quantity
    await this.eventTicketModel.findByIdAndUpdate(eventTicket._id, {
      availableQuantity: (
        parseInt(eventTicket.availableQuantity) - result.noOfUser
      ).toString(),
    });

    // Send confirmation email
    await this.emailService.sendEmail(
      ticket.phone,
      'Ticket Confirmation Skipee',
      'Your ticket has been confirmed',
      `
      <h1>Ticket Confirmation</h1>
      <p>Hi ${ticket.name},</p>
      <p>Thank you for using Skipee. Your ticket has been confirmed.</p>
      <h2>Your ticket details are:</h2>
      <ul>
          <li>Name: ${ticket.name}</li>
          <li>Email: ${ticket.phone}</li>
          <li>Event Name: ${(eventTicket.event as any).name}</li>
          <li>Ticket Name: ${(eventTicket as any).name}</li>
          <li>Quantity: ${ticket.noOfUser}</li>
          <li>Price: ${(eventTicket as any).price} / Person</li>
          <li>Total Amount: ${ticket.amount}</li>
      </ul>
      <h2>Event Details</h2>
      <ul>
          <li>Name: ${(eventTicket.event as any).name}</li>
          <li>Time: ${(eventTicket.event as any).startTime} | ${(eventTicket.event as any).endTime}</li>
          <li>Location: ${(eventTicket.event as any).location}</li>
          <li>Host: ${(eventTicket.site as any).name}</li>
      </ul>
      <br/>
      <strong><a href="http://104.248.165.72:3000/#/book/${ticket._id}?success=true">Link to get your ticket</a></strong>
      <br/>
      <p>Thank you for using Skipee.</p>
      <p>Skipee Team</p>
      `,
    );

    return result;
  } else {
    throw new HttpException('Payment not confirmed', HttpStatus.BAD_REQUEST);
  }
}

async cancelTicket(id: string) {
  const ticket = await this.ticketModel.findById(id);
  if (!ticket) {
    throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
  }

  if (ticket.isConfirmed) {
    throw new HttpException('Confirmed tickets cannot be canceled', HttpStatus.BAD_REQUEST);
  }

  const result = await this.ticketModel.findByIdAndUpdate(
    id,
    { isCancelled: true },
  );

  if (!result) {
    throw new HttpException('Failed to cancel ticket', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  return result;
}



  async getTickets(id: string) {
    const tickets = await this.ticketModel.findById(id).populate({
      path: 'eventTicket',
      populate: [{ path: 'site' }, { path: 'event' }],
    });

    if (!tickets) {
      throw new HttpException('Failed to get tickets', HttpStatus.NOT_FOUND);
    }

    return tickets;
  }

  async getTicketFromticketsType(id: string) {
    const tickets = await this.ticketModel
      .find({ eventTicket: id, isConfirmed: true })
      .populate({
        path: 'eventTicket',
        populate: [{ path: 'site' }, { path: 'event' }],
      });
    if (!tickets) {
      throw new HttpException('Failed to get tickets', HttpStatus.NOT_FOUND);
    }
    return tickets;
  }

  async createCheckoutSession(ticketId: string, host: string) {
    const ticket = await this.ticketModel
      .findById(ticketId)
      .populate('eventTicket')
      .populate('site');
  
    if (!ticket) {
      throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
    }
  
    let eventTicket = ticket.eventTicket;
  
    if (!eventTicket || !(eventTicket as any).price) {
      eventTicket = await this.eventTicketModel.findById(ticket.eventTicket.toString());
    }
  
    const ticketPrice = parseFloat((eventTicket as any).price); // Unit price per ticket
    const totalTickets = ticket.noOfUser; // Number of tickets purchased
    const siteModel = ticket.site as any;
    
    // Calculate commission per ticket
    let commissionPerTicket = parseFloat((ticketPrice * (siteModel.percentageCommission/100)).toFixed(2)) <= siteModel.baseCommission ? siteModel.baseCommission : parseFloat((ticketPrice * (siteModel.percentageCommission/100)).toFixed(2)); // Minimum £1 or 20% of ticket price
    commissionPerTicket = Math.min(commissionPerTicket, siteModel.maxCommission);
    commissionPerTicket = Math.max(commissionPerTicket, siteModel.minCommission);
    // Calculate total commission
    const totalCommission = commissionPerTicket * totalTickets;
  
    // Calculate total purchaser checkout price (ticket price + commission)
    const totalPurchaserPrice = (ticket.amount + totalCommission); // in pence (stripe requires amount in smallest currency unit)
  
    console.log(`Commission per ticket: £${commissionPerTicket}`);
    console.log(`Total Commission for ${totalTickets} tickets: £${totalCommission}`);
    console.log(`Total Purchaser Checkout Price per ticket: £${totalPurchaserPrice}`);
  
    const line_items = [
      {
        price_data: {
          currency: 'GBP',
          product_data: {
            name: (eventTicket as any).name,
          },
          unit_amount: (ticketPrice+commissionPerTicket)*100, // Total price for one ticket (includes ticket + commission)
        },
        quantity: totalTickets,
      },
    ];
  
    const session = await this.stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `http://${host}/#/book/${ticketId}?success=true`,
      cancel_url: `http://${host}/#/book/${ticketId}?success=false`,
      payment_intent_data: {
        application_fee_amount: totalCommission*100, // Stripe commission in pence
        transfer_data: {
          destination: (ticket.site as any).stripeAccountId,
        },
      },
      metadata: {
        eventTicket: (eventTicket as any)._id.toString(),
        ticketId: ticket._id.toString(),
        event: (eventTicket as any).event.toString(),
      },
    });
  
    // Save the Stripe session ID to the ticket for later confirmation
    await this.ticketModel.findByIdAndUpdate(ticketId, { stripeSessionId: session.id });
  
    return session;
  }

  async getAllTickets(user: any) {
    console.log(user);
    const query = {};
    if (user.role !== 'admin') {
      query['site'] = new Types.ObjectId(user.worksIn);
    }
    let tickets = await this.ticketModel
      .find(query)
      // .where('eventTicket.site').equals(new Types.ObjectId(user.worksIn))
      .populate({
        path: 'eventTicket',
        populate: [{ path: 'site' }, { path: 'event' }],
      })
      .sort({ createdAt: -1 })
      .exec();

    if (!tickets) {
      throw new Error('Failed to get tickets');
    }
    return tickets;
  }
}
