import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Ticket } from './schemas/tickets.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTicketDto } from './dto/create-ticket.dto';
import Stripe from 'stripe';
import { EventTicket } from 'src/sites/schemas/event-ticket.schema';
import { Site } from 'src/sites/schemas/sites.schema';
import { EmailService } from 'src/email/email.service';
import * as QRCode from 'qrcode';

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
  async generateQRCode(value: string): Promise<string> {
    try {
      // Generate a QR code and return it as a Base64 string
      const qrCodeDataURL = await QRCode.toDataURL(value, {
        errorCorrectionLevel: 'H', // High error correction level
        type: 'image/png', // Output as PNG
        margin: 2, // Add some margin around the QR code
        width: 256, // Set width
      });
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR Code:', error);
      throw new HttpException(
        'Failed to generate QR code',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
    const qrCodeDataURL = await this.generateQRCode(ticket._id.toString());
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
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header-banner {
      background-color: #ffffff;
      text-align: center;
      padding: 15px;
      color: white;
      font-weight: bold;
      font-size: 18px;
      text-transform: uppercase;
      justify-content: center;
      justify-items: center;
    }
    .header-text {
      background-color: #1DB954;
      width: 30%;
      text-align: center;
      padding: 10px;
      color: white;
      font-weight: 1px;
      font-size: 16px;
      text-transform: uppercase;
      border-radius: 10px;
    }

    .content {
      padding: 20px;
      text-align: center;
    }
    .content h1 {
      font-size: 24px;
      margin: 10px 0;
      font-weight: bold;
    }
    .content h1 span {
      font-style: italic;
      font-family: 'Times New Roman', Times, serif;
      font-size: 25px;
    }
    .content p {
      font-size: 12px;
      color: #8d8d8d;
      margin-bottom: 20px;
    }
    .details-section {
      text-align: left;
      margin: 20px 0;
    }
    .details-section table {
  width: 100%;
  border-collapse: collapse;
}

.details-section td {
  padding: 8px 10px;
  vertical-align: top;
}

.details-section td.label {
  text-align: left; /* Ensure the first column is left-aligned */
  font-weight: normal;
  color: #666; /* Adjust color for labels */
}

.details-section td.value {
  text-align: right; /* Right-align the second column */
  font-weight: bold;
  color: #333; /* Adjust color for values */

}

.details-section .total-row td {
  font-weight: bold;
  border-top: 3px solid #1DB954; /* Add a line above the total */
  border-bottom: 3px solid #1DB954;
  padding-top: 10px;
}
    .qr-code {
      margin: 20px 0;
      text-align: center;
    }
    .qr-code img {
      width: 120px;
      height: 120px;
    }
    .access-ticket {
      display: inline-block;
      background-color: #28a745;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: bold;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #666;
    }
    .footer a {
      color: #28a745;
      text-decoration: none;
    }
    .logo {
      margin: 10px auto;
    }
    .logo img {
      max-width: 150px;
    }
    .footer-note {
      font-style: italic;
      margin-top: 10px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Banner -->
    <div class="header-banner">
        <div class="header-text ">
            Happy Skipping
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="content">
      <h1>YOUR <span>TICKET</span> IS CONFIRMED!</h1>
      <hr style="border: none; border-top: 2px dotted #ccc; margin: 10px 0;">
      <p>Hi ${ticket.name}, Thank you for using Skipee, your ticket is ready - let the skipping begin!</p>
      
      <!-- Ticket Details -->
      <h2 style="margin-top: 30px; font-size: 18px;">Ticket Details</h2>
      <div class="details-section">
        <table>
          <tr>
            <td class="label">Name</td>
            <td class="value">${ticket.name}</td>
          </tr>
          <tr>
            <td class="label">Email</td>
            <td class="value">${ticket.phone}</td>
          </tr>
          <tr>
            <td class="label">Event Name</td>
            <td class="value">${(eventTicket.event as any).name}</td>
          </tr>
          <tr>
            <td class="label">Ticket Name</td>
            <td class="value">${(eventTicket as any).name}</td>
          </tr>
          <tr>
            <td class="label">Price</td>
            <td class="value">£  ${(eventTicket as any).price}</td>
          </tr>
          <tr>
            <td class="label">Quantity</td>
            <td class="value">${ticket.noOfUser}</td>
          </tr>
          <tr class="total-row">
            <td>Total Amount</td>
            <td class="value">£ ${ticket.amount}</td>
          </tr>
        </table>
      </div>

      <!-- Event Details -->
      <h2 style="margin-top: 30px; font-size: 18px;">Event Details</h2>
      <div class="details-section">
        <table>
          <tr>
            <td class="label">Event Name</td>
            <td class="value">${(eventTicket.event as any).name}</td>
          </tr>
          <tr>
            <td class="label">Time</td>
            <td class="value">${(eventTicket.event as any).startTime} | ${(eventTicket.event as any).endTime}</td>
          </tr>
          <tr>
            <td class="label">Location</td>
            <td class="value">${(eventTicket.event as any).location}</td>
          </tr>
          <tr>
            <td class="label">Host</td>
            <td class="value">${(eventTicket.site as any).name}</td>
          </tr>
        </table>
      </div>

      <!-- QR Code -->
      <div class="qr-code">
        <img src="${qrCodeDataURL}" alt="QR Code">
      </div>

      <!-- Access Ticket Button -->
      <a href="http://104.248.165.72:3000/#/book/${ticket._id}?success=true" class="access-ticket">
        Access Your Ticket
      </a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Notice something wrong? Contact us at <a href="mailto:support@skipee.com">support@skipee.com</a> and we'll be happy to help.</p>
      <div class="logo">
        <img src="https://firebasestorage.googleapis.com/v0/b/skipee-ba66f.appspot.com/o/event-images%2Flogo.png?alt=media&token=cf012fd8-37eb-46c6-bcdb-2ee9cad76379" alt="Skipee Logo">
      </div>
      <p class="footer-note">Thank You for being a Great Customer</p>
    </div>
  </div>
</body>
</html>

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
