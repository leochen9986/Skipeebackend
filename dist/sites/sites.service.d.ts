/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import mongoose, { Model } from 'mongoose';
import { Site } from './schemas/sites.schema';
import { CreateSiteDto } from './dto/create-site.dto';
import { UsersService } from 'src/users/users.service';
import { EventTicket } from './schemas/event-ticket.schema';
import { CreateEventDto } from './dto/create-events.dto';
import { Event } from './schemas/event.schema';
import { CreateEventTicketDto } from './dto/create-event-tickets.dto';
import { User } from 'src/users/schemas/user.schema';
export declare class SitesService {
    private readonly siteModel;
    private readonly eventModel;
    private readonly eventTicketModel;
    private readonly userModel;
    private readonly usersService;
    constructor(siteModel: Model<Site>, eventModel: Model<Event>, eventTicketModel: Model<EventTicket>, userModel: Model<User>, usersService: UsersService);
    updateLogo(siteId: string, logoPath: string): Promise<mongoose.Document<unknown, {}, Site> & Site & {
        _id: mongoose.Types.ObjectId;
    }>;
    createSite(createSiteDto: CreateSiteDto, userId: string): Promise<mongoose.Document<unknown, {}, Site> & Site & {
        _id: mongoose.Types.ObjectId;
    }>;
    getAllSites(search: string): Promise<Omit<mongoose.Document<unknown, {}, Site> & Site & {
        _id: mongoose.Types.ObjectId;
    }, never>[]>;
    getSiteById(id: string): Promise<mongoose.Document<unknown, {}, Site> & Site & {
        _id: mongoose.Types.ObjectId;
    }>;
    deleteSite(id: string): Promise<mongoose.Document<unknown, {}, Site> & Site & {
        _id: mongoose.Types.ObjectId;
    }>;
    createEvent(createEventDto: CreateEventDto, userId: string): Promise<mongoose.Document<unknown, {}, Event> & Event & {
        _id: mongoose.Types.ObjectId;
    }>;
    updateEvent(id: string, createEventDto: CreateEventDto, userId: string): Promise<mongoose.Document<unknown, {}, Event> & Event & {
        _id: mongoose.Types.ObjectId;
    }>;
    requestSite(id: string, status: any, _id: any): Promise<mongoose.Document<unknown, {}, Site> & Site & {
        _id: mongoose.Types.ObjectId;
    }>;
    addTickets(id: string, createEventArrayDto: [CreateEventTicketDto], userId: any): Promise<mongoose.Document<unknown, {}, Event> & Event & {
        _id: mongoose.Types.ObjectId;
    }>;
    updateTicket(id: string, updateEventTicketDto: CreateEventTicketDto, userId: any): Promise<mongoose.Document<unknown, {}, EventTicket> & EventTicket & {
        _id: mongoose.Types.ObjectId;
    }>;
    getEvents(siteId: string, status: string, search: string, user: any): Promise<Omit<Omit<Omit<mongoose.Document<unknown, {}, Event> & Event & {
        _id: mongoose.Types.ObjectId;
    }, never>, never>, never>[]>;
    getEventById(id: string): Promise<mongoose.Document<unknown, {}, Event> & Event & {
        _id: mongoose.Types.ObjectId;
    }>;
    getEmployees(userId: string): Promise<(mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    deleteEvent(id: string, userId: string): Promise<mongoose.Document<unknown, {}, Event> & Event & {
        _id: mongoose.Types.ObjectId;
    }>;
    deleteTickets(id: string, userId: string): Promise<mongoose.Document<unknown, {}, EventTicket> & EventTicket & {
        _id: mongoose.Types.ObjectId;
    }>;
}
