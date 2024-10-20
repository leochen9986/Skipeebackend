"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsServices = void 0;
const common_1 = require("@nestjs/common");
const tickets_schema_1 = require("./schemas/tickets.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const stripe_1 = require("stripe");
const event_ticket_schema_1 = require("../sites/schemas/event-ticket.schema");
const email_service_1 = require("../email/email.service");
let TicketsServices = class TicketsServices {
    constructor(ticketModel, eventTicketModel, emailService) {
        this.ticketModel = ticketModel;
        this.eventTicketModel = eventTicketModel;
        this.emailService = emailService;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2024-06-20',
        });
    }
    async createTicket(ticket) {
        const eventTicket = await this.eventTicketModel.findById(ticket.eventTicket);
        if (!eventTicket) {
            throw new common_1.HttpException('Event ticket not found', common_1.HttpStatus.NOT_FOUND);
        }
        const availableTicketQuantity = parseInt(eventTicket.availableQuantity);
        if (availableTicketQuantity < ticket.noOfUser) {
            throw new common_1.HttpException('Not enough tickets available', common_1.HttpStatus.NOT_FOUND);
        }
        const createdTicket = new this.ticketModel({
            ...ticket,
            site: eventTicket.site,
            event: eventTicket.event,
            amount: parseFloat(eventTicket.price) * ticket.noOfUser,
        });
        const result = await createdTicket.save();
        if (!result) {
            throw new common_1.HttpException('Failed to create ticket', common_1.HttpStatus.NOT_FOUND);
        }
        return await this.createCheckoutSession(result._id.toString(), 'skipee-web-3xdw.vercel.app');
    }
    async approveTicket(id, quantity) {
        const ticket = await this.ticketModel.findById(id);
        const remaining_ticket = ticket.noOfUser - ticket.entered;
        const toenter = parseInt(quantity.toString()) + parseInt(ticket.entered.toString());
        if (!ticket.isConfirmed) {
            throw new common_1.HttpException('Failed to approve ticket', common_1.HttpStatus.NOT_FOUND);
        }
        if (quantity > remaining_ticket) {
            throw new common_1.HttpException('Ticket is only remaining for ' + remaining_ticket + ' users', common_1.HttpStatus.BAD_REQUEST);
        }
        const result = await this.ticketModel
            .findByIdAndUpdate(id, { isScaned: true, entered: toenter }, {
            new: true,
        })
            .populate({
            path: 'eventTicket',
            populate: [{ path: 'site' }, { path: 'event' }],
        });
        if (!result) {
            throw new common_1.HttpException('Failed to approve ticket', common_1.HttpStatus.NOT_FOUND);
        }
        return result;
    }
    async confirmTicket(id) {
        const check = await this.ticketModel.findById(id);
        if (!check) {
            throw new common_1.HttpException('Ticket not found', common_1.HttpStatus.NOT_FOUND);
        }
        const result = await this.ticketModel.findByIdAndUpdate(id, {
            isConfirmed: true,
        });
        if (!result) {
            throw new common_1.HttpException('Failed to confirm ticket', common_1.HttpStatus.NOT_FOUND);
        }
        if (!check.isConfirmed) {
            const eventTicket = await this.eventTicketModel
                .findById(result.eventTicket.toString())
                .populate('site')
                .populate('event');
            await this.eventTicketModel.findByIdAndUpdate(eventTicket._id, {
                availableQuantity: (parseInt(eventTicket.availableQuantity) - result.noOfUser).toString(),
            });
            await this.emailService.sendEmail(check.phone, 'Ticket Confirmation Skipee', 'Your ticket has been confirmed', `

      <h1>Ticket Confirmation</h1>
      <p>Hi ${check.name},</p>
      <p>Thank you for using Skipee. Your ticket has been confirmed. </p>
      <h2> Your ticket details are: </h2>
      <ul>
          <li>Name: ${check.name}</li>
          <li>Email: ${check.phone}</li>
          <li>Event Name: ${eventTicket.event.name}</li>
          <li>Ticket Name: ${eventTicket.name}</li>
          <li>Quantity: ${result.noOfUser}</li>
          <li>Price: ${eventTicket.price} / Person</li>
          <li>Total Amount: ${result.amount}</li>
      </ul>

      <h2>Evnet Details</h2>
      <ul>
          <li>Name: ${eventTicket.event.name}</li>
          <li>Time: ${eventTicket.event.startTime} | ${eventTicket.event.endTime}</li>
          <li>Location: ${eventTicket.event.location}</li>
          <li>Host: ${eventTicket.site.name}</li>
      </ul>

      <br/>
      <br/>
      <strong><a href="https://skipee-web-3xdw.vercel.app/#/book/${check._id}?success=true">Link to get your ticket</a></strong>
      <br/>
      <br/>

      <p> Thank you for using Skipee. </p>
      <p> Skipee Team </p>
      `);
        }
        return result;
    }
    async getTickets(id) {
        const tickets = await this.ticketModel.findById(id).populate({
            path: 'eventTicket',
            populate: [{ path: 'site' }, { path: 'event' }],
        });
        if (!tickets) {
            throw new common_1.HttpException('Failed to get tickets', common_1.HttpStatus.NOT_FOUND);
        }
        return tickets;
    }
    async getTicketFromticketsType(id) {
        const tickets = await this.ticketModel
            .find({ eventTicket: id, isConfirmed: true })
            .populate({
            path: 'eventTicket',
            populate: [{ path: 'site' }, { path: 'event' }],
        });
        if (!tickets) {
            throw new common_1.HttpException('Failed to get tickets', common_1.HttpStatus.NOT_FOUND);
        }
        return tickets;
    }
    async createCheckoutSession(ticketId, host) {
        const ticket = await this.ticketModel
            .findById(ticketId)
            .populate('eventTicket')
            .populate('site');
        if (!ticket) {
            throw new common_1.HttpException('Ticket not found', common_1.HttpStatus.NOT_FOUND);
        }
        let comission = 0;
        if (ticket.site) {
            const siteModel = ticket.site;
            comission += siteModel.baseCommission;
            comission += (ticket.amount * siteModel.percentageCommission) / 100;
            comission = Math.min(comission, siteModel.maxCommission);
            comission = Math.max(comission, siteModel.minCommission);
            comission = Math.floor(comission * 100);
        }
        const line_items = [];
        let eventTicket = ticket.eventTicket;
        if (!(ticket.eventTicket && ticket.eventTicket.price)) {
            eventTicket = await this.eventTicketModel.findById(ticket.eventTicket.toString());
        }
        line_items.push({
            price_data: {
                currency: 'GBP',
                product_data: {
                    name: eventTicket.name,
                },
                unit_amount: eventTicket.price * 100,
            },
            quantity: ticket.noOfUser,
        });
        const session = await this.stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: 'http://' + host + '/#/book/' + ticketId + '?success=true',
            cancel_url: 'http://' + host + '/#/book/' + ticketId + '?success=false',
            payment_intent_data: {
                application_fee_amount: comission,
                transfer_data: {
                    destination: ticket.site.stripeAccountId,
                },
            },
            metadata: {
                eventTicket: eventTicket._id.toString(),
                ticketId: ticket._id.toString(),
                event: eventTicket.event.toString(),
            },
        });
        return session;
    }
    async getAllTickets(user) {
        console.log(user);
        const query = {};
        if (user.role !== 'admin') {
            query['site'] = new mongoose_1.Types.ObjectId(user.worksIn);
        }
        let tickets = await this.ticketModel
            .find(query)
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
};
exports.TicketsServices = TicketsServices;
exports.TicketsServices = TicketsServices = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(tickets_schema_1.Ticket.name)),
    __param(1, (0, mongoose_2.InjectModel)(event_ticket_schema_1.EventTicket.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        email_service_1.EmailService])
], TicketsServices);
//# sourceMappingURL=tickets.services.js.map