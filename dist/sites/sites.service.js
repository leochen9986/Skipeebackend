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
    async updateLogo(siteId, logo, userId) {
        const site = await this.siteModel.findById(siteId);
        if (!site) {
            throw new common_1.HttpException('Site not found', common_1.HttpStatus.NOT_FOUND);
        }
        site.logo = logo;
        const updatedSite = await site.save();
        return updatedSite;
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
    async getPaginatedSites(search, archived, skipping, ticketing, ownerId, pageNumber = 1, limitNumber = 10) {
        const filter = {};
        if (archived !== undefined) {
            filter.archived = archived;
        }
        else {
            filter.archived = false;
        }
        if (skipping !== undefined) {
            filter.skipping = skipping;
        }
        if (ticketing !== undefined) {
            filter.ticketing = ticketing;
        }
        if (search) {
            filter.name = new RegExp(search, 'i');
        }
        if (ownerId) {
            if (!mongoose_1.default.Types.ObjectId.isValid(ownerId)) {
                throw new common_1.HttpException('Invalid ownerId', common_1.HttpStatus.BAD_REQUEST);
            }
            filter.owner = new mongoose_1.Types.ObjectId(ownerId);
        }
        const skip = (pageNumber - 1) * limitNumber;
        const sites = await this.siteModel
            .find(filter)
            .populate('owner')
            .skip(skip)
            .limit(limitNumber)
            .exec();
        const totalCount = await this.siteModel.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / limitNumber);
        return {
            sites,
            totalCount,
            currentPage: pageNumber,
            totalPages,
        };
    }
    async archiveSite(siteId, userId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(siteId)) {
            throw new common_1.HttpException('Invalid site ID', common_1.HttpStatus.BAD_REQUEST);
        }
        const site = await this.siteModel.findById(siteId);
        if (!site) {
            throw new common_1.HttpException('Site not found', common_1.HttpStatus.NOT_FOUND);
        }
        site.archived = true;
        await site.save();
        return site;
    }
    async getAllSites(search, archived, skipping, ticketing, ownerId) {
        const filter = {};
        console.log("heyyy");
        if (archived !== undefined) {
            filter.archived = archived;
        }
        else {
            filter.archived = false;
        }
        console.log(skipping);
        if (skipping !== undefined) {
            filter.skipping = skipping;
        }
        else {
            if (ticketing !== undefined) {
                filter.ticketing = ticketing;
            }
        }
        if (search) {
            filter.name = new RegExp(search, 'i');
        }
        if (ownerId) {
            if (!mongoose_1.default.Types.ObjectId.isValid(ownerId)) {
                throw new common_1.HttpException('Invalid ownerId', common_1.HttpStatus.BAD_REQUEST);
            }
            filter.owner = new mongoose_1.Types.ObjectId(ownerId);
        }
        const sites = await this.siteModel.find(filter).populate('owner');
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
        const site = await this.siteModel.findById(id);
        if (!site) {
            throw new common_1.HttpException('Site not found', common_1.HttpStatus.NOT_FOUND);
        }
        site.archived = true;
        const updatedSite = await site.save();
        return updatedSite;
    }
    async createEvent(createEventDto, siteId, userId) {
        const owner = await this.usersService.getUser(userId);
        if (!owner) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const site = await this.siteModel.findById(siteId);
        if (!site) {
            throw new common_1.HttpException('Site not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!site.approved) {
            throw new common_1.HttpException('Your venue is still in review', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const image = createEventDto.image && createEventDto.image.trim() !== ''
            ? createEventDto.image
            : 'https://firebasestorage.googleapis.com/v0/b/skipee-ba66f.appspot.com/o/event-images%2Flogo.png?alt=media&token=e2db1b1c-f6c9-46cc-9a35-faba6e31ddb1';
        const createdEvent = new this.eventModel({
            ...createEventDto,
            image,
            owner: owner._id,
            site: site._id,
        });
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
        const image = createEventDto.image && createEventDto.image.trim() !== ''
            ? createEventDto.image
            : event.image || 'https://firebasestorage.googleapis.com/v0/b/skipee-ba66f.appspot.com/o/event-images%2Flogo.png?alt=media&token=e2db1b1c-f6c9-46cc-9a35-faba6e31ddb1';
        const updatedData = {
            ...createEventDto,
            image,
        };
        const result = await this.eventModel.findByIdAndUpdate(id, updatedData, {
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
    async addTicket(eventId, createEventTicketDto, userId) {
        const user = await this.usersService.getUser(userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const event = await this.eventModel.findById(eventId).populate('owner').populate('site');
        if (!event) {
            throw new common_1.HttpException('Event not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (event.owner._id.toString() !== user._id.toString()) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const ticketData = {
            ...createEventTicketDto,
            site: event.site._id,
            event: event._id,
            availableQuantity: createEventTicketDto.totalQuantity,
        };
        const ticket = new this.eventTicketModel(ticketData);
        const savedTicket = await ticket.save();
        if (!savedTicket) {
            throw new common_1.HttpException('Failed to add ticket', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        event.tickets.push(savedTicket._id);
        event.status = event_schema_1.eventStatus.UPCOMING;
        await event.save();
        return savedTicket;
    }
    async updateTicket(ticketId, updateEventTicketDto, userId) {
        const eventTicket = await this.eventTicketModel
            .findById(ticketId)
            .populate('event');
        if (!eventTicket || !eventTicket.event) {
            throw new common_1.HttpException('Ticket or event not found', common_1.HttpStatus.NOT_FOUND);
        }
        const result = await this.eventTicketModel.findByIdAndUpdate(ticketId, updateEventTicketDto, { new: true });
        return result;
    }
    async getSitesOwnedByUser(userId) {
        return this.siteModel.find({ owner: userId });
    }
    async getEvents(siteId, siteIds, status, search, user) {
        const now = new Date().setHours(0, 0, 0, 0);
        await this.eventModel.updateMany({
            date: { $lt: now },
            endDate: null,
            status: { $ne: event_schema_1.eventStatus.COMPLETED },
        }, { $set: { status: event_schema_1.eventStatus.COMPLETED } });
        const matchConditions = {};
        if (siteId) {
            matchConditions['site'] = new mongoose_1.default.Types.ObjectId(siteId);
        }
        else if (siteIds && siteIds.length > 0) {
            matchConditions['site'] = { $in: siteIds.map((id) => new mongoose_1.default.Types.ObjectId(id)) };
        }
        console.log(status);
        console.log(Array.isArray(status));
        if (status) {
            if (typeof status === 'string') {
                const statusArray = status.split(',').map(item => item.trim());
                matchConditions['status'] = { $in: statusArray };
            }
            else {
                matchConditions['status'] = Array.isArray(status) ? { $in: status } : status;
            }
        }
        const pipeline = [];
        if (Object.keys(matchConditions).length > 0) {
            pipeline.push({ $match: matchConditions });
        }
        pipeline.push({
            $lookup: {
                from: 'sites',
                localField: 'site',
                foreignField: '_id',
                as: 'site'
            }
        });
        pipeline.push({ $unwind: '$site' });
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            pipeline.push({
                $match: {
                    $or: [
                        { 'name': searchRegex },
                        { 'site.name': searchRegex }
                    ]
                }
            });
        }
        pipeline.push({
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
            }
        });
        pipeline.push({ $unwind: '$owner' });
        pipeline.push({
            $lookup: {
                from: 'eventtickets',
                localField: 'tickets',
                foreignField: '_id',
                as: 'tickets'
            }
        });
        pipeline.push({ $sort: { endDate: -1, date: -1 } });
        const events = await this.eventModel.aggregate(pipeline);
        if (!events || events.length === 0) {
            return events;
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
        const userOwnedSites = await this.siteModel.find({ owner: userId });
        if (!userOwnedSites || userOwnedSites.length === 0) {
            throw new common_1.HttpException('No sites found for the given owner', common_1.HttpStatus.NOT_FOUND);
        }
        const siteIds = userOwnedSites.map((site) => site._id.toString());
        console.log(siteIds);
        const employees = await this.userModel
            .find({
            worksIn: { $in: siteIds },
        })
            .populate('worksIn');
        return employees;
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