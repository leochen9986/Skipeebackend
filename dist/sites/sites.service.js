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
exports.SitesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const sites_schema_1 = require("./schemas/sites.schema");
const users_service_1 = require("../users/users.service");
const event_ticket_schema_1 = require("./schemas/event-ticket.schema");
const event_schema_1 = require("./schemas/event.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let SitesService = class SitesService {
    constructor(siteModel, eventModel, eventTicketModel, userModel, usersService) {
        this.siteModel = siteModel;
        this.eventModel = eventModel;
        this.eventTicketModel = eventTicketModel;
        this.userModel = userModel;
        this.usersService = usersService;
    }
    async updateLogo(siteId, logoPath) {
        const site = await this.siteModel.findByIdAndUpdate(siteId, { logo: logoPath }, { new: true });
        if (!site) {
            throw new common_1.HttpException('Site not found', common_1.HttpStatus.NOT_FOUND);
        }
        return site;
    }
    async createSite(createSiteDto, userId) {
        const owner = await this.usersService.getUser(userId);
        if (!owner) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const site = await this.siteModel.findOne({
            name: createSiteDto.name,
        });
        if (site) {
            throw new common_1.HttpException('Site with this name already exists', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const ownedSite = await this.siteModel.findOne({
            owner: owner._id,
        });
        if (ownedSite && !owner.worksIn) {
            await this.usersService.updateMyProfile(owner._id.toString(), {
                worksIn: ownedSite._id.toString(),
            });
        }
        if (ownedSite) {
            throw new common_1.HttpException('You already have a site', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const createdSite = new this.siteModel({
            ...createSiteDto,
            owner: owner._id,
        });
        const result = await createdSite.save();
        owner.worksIn = result._id;
        await this.usersService.updateMyProfile(owner._id.toString(), {
            worksIn: result._id.toString(),
        });
        if (!result) {
            throw new Error('Failed to create site');
        }
        return result;
    }
    async getAllSites(search) {
        if (search) {
            const sites = await this.siteModel
                .find({ name: new RegExp(search, 'i') })
                .populate('owner');
            if (!sites) {
                throw new common_1.HttpException('Failed to get sites', common_1.HttpStatus.NOT_FOUND);
            }
            return sites;
        }
        const sites = await this.siteModel.find().populate('owner');
        if (!sites) {
            throw new common_1.HttpException('Failed to get sites', common_1.HttpStatus.NOT_FOUND);
        }
        return sites;
    }
    async getSiteById(id) {
        const site = await this.siteModel.findById(id);
        if (!site) {
            throw new common_1.HttpException('Failed to get site', common_1.HttpStatus.NOT_FOUND);
        }
        return site;
    }
    async deleteSite(id) {
        const result = await this.siteModel.findByIdAndDelete(id);
        const user = await this.userModel.findByIdAndDelete(result.owner);
        const userRequest = await this.userModel.findByIdAndDelete(result.owner);
        if (!result) {
            throw new common_1.HttpException('Failed to delete site', common_1.HttpStatus.NOT_FOUND);
        }
        return result;
    }
    async createEvent(createEventDto, userId) {
        const owner = await this.usersService.getUser(userId);
        if (!owner) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const event = await this.siteModel.findOne({
            owner: owner._id,
        });
        if (!event || !event.approved) {
            throw new common_1.HttpException(!event ? 'You do not have a venue' : 'Your venue is still in review', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const createdEvent = new this.eventModel({
            ...createEventDto,
            owner: owner._id,
            site: event._id,
        });
        console.log(createdEvent);
        const result = await createdEvent.save();
        if (!result) {
            throw new common_1.HttpException('Failed to create event', common_1.HttpStatus.NOT_FOUND);
        }
        const newEvent = await this.eventModel
            .findById(result._id)
            .populate('site')
            .populate('owner')
            .populate('tickets');
        return newEvent;
    }
    async updateEvent(id, createEventDto, userId) {
        const event = await this.eventModel.findById(id);
        if (!event) {
            throw new common_1.HttpException('Event not found', common_1.HttpStatus.NOT_FOUND);
        }
        const user = await this.usersService.getUser(userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.role === 'manager' && user.worksIn !== event.site) {
            throw new common_1.HttpException('You do not have permission to update events', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const result = await this.eventModel.findByIdAndUpdate(id, createEventDto, {
            new: true,
        });
        if (!result) {
            throw new common_1.HttpException('Failed to update event', common_1.HttpStatus.NOT_FOUND);
        }
        return result;
    }
    async requestSite(id, status, _id) {
        const user = await this.usersService.getUser(_id);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.role !== 'admin') {
            throw new common_1.HttpException('Only admins can approve sites', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const site = await this.siteModel.findById(id);
        if (!site) {
            throw new common_1.HttpException('Site not found', common_1.HttpStatus.NOT_FOUND);
        }
        site.approved = status;
        const result = await site.save();
        if (!result) {
            throw new common_1.HttpException('Failed to update site', common_1.HttpStatus.NOT_FOUND);
        }
        return result;
    }
    async addTickets(id, createEventArrayDto, userId) {
        const user = await this.usersService.getUser(userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const event = await (await (await (await this.eventModel.findById(id)).populate('tickets')).populate('owner')).populate('site');
        if (!event ||
            !event.owner ||
            event.owner._id.toString() !== user._id.toString()) {
            throw new common_1.HttpException('Event not found', common_1.HttpStatus.NOT_FOUND);
        }
        const ticketsBody = createEventArrayDto.map((ticket) => {
            return {
                ...ticket,
                site: event.site._id,
                event: event._id,
                availableQuantity: ticket.totalQuantity,
            };
        });
        const tickets = await this.eventTicketModel.insertMany(ticketsBody);
        if (!tickets) {
            throw new common_1.HttpException('Failed to add tickets', common_1.HttpStatus.NOT_FOUND);
        }
        event.tickets = [
            ...event.tickets.map((ticket) => ticket._id),
            ...tickets.map((ticket) => ticket._id),
        ];
        event.status = event_schema_1.eventStatus.UPCOMING;
        const result = await event.save();
        if (!result) {
            throw new common_1.HttpException('Failed to add tickets', common_1.HttpStatus.NOT_FOUND);
        }
        return result;
    }
    async updateTicket(id, updateEventTicketDto, userId) {
        const user = await this.usersService.getUser(userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const eventTicket = await this.eventTicketModel
            .findById(id)
            .populate('event');
        if (!eventTicket.event ||
            !eventTicket.event.owner ||
            eventTicket.event.owner._id.toString() !== user._id.toString()) {
            throw new common_1.HttpException('Event not found', common_1.HttpStatus.NOT_FOUND);
        }
        const result = await this.eventTicketModel.findByIdAndUpdate(id, {
            ...updateEventTicketDto,
            availableQuantity: updateEventTicketDto.totalQuantity -
                parseInt(eventTicket.totalQuantity) +
                parseInt(eventTicket.availableQuantity),
        });
        if (!result) {
            throw new common_1.HttpException('Failed to update tickets', common_1.HttpStatus.NOT_FOUND);
        }
        return result;
    }
    async getEvents(siteId, status, search, user) {
        const filter = {};
        if (siteId) {
            filter['site'] = new mongoose_1.default.Types.ObjectId(siteId);
        }
        if (status) {
            filter['status'] = status;
        }
        else {
            filter['status'] = { $nin: [event_schema_1.eventStatus.COMPLETED, event_schema_1.eventStatus.DRAFT] };
        }
        if (search) {
            filter['name'] = new RegExp(search, 'i');
        }
        const now = new Date().setHours(0, 0, 0, 0);
        await this.eventModel.updateMany({
            date: { $lt: now },
            endDate: null,
            status: { $ne: event_schema_1.eventStatus.COMPLETED },
        }, { $set: { status: event_schema_1.eventStatus.COMPLETED } });
        await this.eventModel.updateMany({
            date: { $gte: now },
            status: { $ne: event_schema_1.eventStatus.DRAFT },
        }, { $set: { status: event_schema_1.eventStatus.UPCOMING } });
        const events = await this.eventModel
            .find(filter)
            .populate('site')
            .populate('owner')
            .populate('tickets')
            .sort({ endDate: -1, date: -1 });
        if (!events) {
            throw new common_1.HttpException('Failed to get events', common_1.HttpStatus.NOT_FOUND);
        }
        return events;
    }
    async getEventById(id) {
        const event = await this.eventModel
            .findById(id)
            .populate('site')
            .populate('owner')
            .populate('tickets');
        if (!event) {
            throw new common_1.HttpException('Failed to get event', common_1.HttpStatus.NOT_FOUND);
        }
        return event;
    }
    async getEmployees(userId) {
        const user = await this.usersService.getUser(userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!user.worksIn || user.worksIn === null) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const allUsersForSite = await this.userModel.find({
            worksIn: user.worksIn._id.toString(),
        });
        return allUsersForSite;
    }
    async deleteEvent(id, userId) {
        const user = await this.usersService.getUser(userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!user.worksIn || user.worksIn === null) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const result = await this.eventModel.findByIdAndDelete(id);
        if (!result) {
            throw new common_1.HttpException('Failed to delete event', common_1.HttpStatus.NOT_FOUND);
        }
        return result;
    }
    async deleteTickets(id, userId) {
        const user = await this.usersService.getUser(userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!user.worksIn || user.worksIn === null) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const result = await this.eventTicketModel.findByIdAndDelete(id);
        if (!result) {
            throw new common_1.HttpException('Failed to delete tickets', common_1.HttpStatus.NOT_FOUND);
        }
        return result;
    }
};
exports.SitesService = SitesService;
exports.SitesService = SitesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(sites_schema_1.Site.name)),
    __param(1, (0, mongoose_2.InjectModel)(event_schema_1.Event.name)),
    __param(2, (0, mongoose_2.InjectModel)(event_ticket_schema_1.EventTicket.name)),
    __param(3, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        users_service_1.UsersService])
], SitesService);
//# sourceMappingURL=sites.service.js.map