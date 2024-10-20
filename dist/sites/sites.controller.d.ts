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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { Site } from './schemas/sites.schema';
import { CreateEventDto } from './dto/create-events.dto';
import { Event } from './schemas/event.schema';
import { CreateEventTicketDto } from './dto/create-event-tickets.dto';
export declare class SitesController {
    private readonly sitesService;
    constructor(sitesService: SitesService);
    createSite(createSiteDto: CreateSiteDto, user: any): Promise<import("mongoose").Document<unknown, {}, Site> & Site & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getAllSites(search: any): Promise<Omit<import("mongoose").Document<unknown, {}, Site> & Site & {
        _id: import("mongoose").Types.ObjectId;
    }, never>[]>;
    requestSite(id: string, user: any, status: any): Promise<import("mongoose").Document<unknown, {}, Site> & Site & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getEvents(user: any, siteId: string, status: any, search: any): Promise<Omit<Omit<Omit<import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, never>, never>[]>;
    getEmployees(user: any): Promise<(import("mongoose").Document<unknown, {}, import("src/users/schemas/user.schema").User> & import("src/users/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getEventById(id: string): Promise<import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getSiteById(id: string): Promise<import("mongoose").Document<unknown, {}, Site> & Site & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteSite(id: string, user: any): Promise<import("mongoose").Document<unknown, {}, Site> & Site & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createEvent(createEventDto: CreateEventDto, user: any): Promise<import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateEvent(id: string, createEventDto: CreateEventDto, user: any): Promise<import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateEventTicket(id: string, createEventArrayDto: [CreateEventTicketDto], user: any): Promise<import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    addTickets(id: string, updateEventTicketDto: CreateEventTicketDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("src/sites/schemas/event-ticket.schema").EventTicket> & import("src/sites/schemas/event-ticket.schema").EventTicket & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteEvent(id: string, user: any): Promise<import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteTickets(id: string, user: any): Promise<import("mongoose").Document<unknown, {}, import("src/sites/schemas/event-ticket.schema").EventTicket> & import("src/sites/schemas/event-ticket.schema").EventTicket & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
