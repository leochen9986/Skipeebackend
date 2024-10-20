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
exports.SitesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sites_service_1 = require("./sites.service");
const create_site_dto_1 = require("./dto/create-site.dto");
const secure_decorator_1 = require("../auth/decorator/secure.decorator");
const public_decorator_1 = require("../auth/decorator/public.decorator");
const sites_schema_1 = require("./schemas/sites.schema");
const user_decorator_1 = require("../auth/decorator/user.decorator");
const create_events_dto_1 = require("./dto/create-events.dto");
const event_schema_1 = require("./schemas/event.schema");
const create_event_tickets_dto_1 = require("./dto/create-event-tickets.dto");
let SitesController = class SitesController {
    constructor(sitesService) {
        this.sitesService = sitesService;
    }
    createSite(createSiteDto, user) {
        return this.sitesService.createSite(createSiteDto, user._id);
    }
    getAllSites(search) {
        return this.sitesService.getAllSites(search);
    }
    requestSite(id, user, status) {
        return this.sitesService.requestSite(id, status, user._id);
    }
    getEvents(user, siteId, status, search) {
        return this.sitesService.getEvents(siteId, status, search, user);
    }
    getEmployees(user) {
        return this.sitesService.getEmployees(user._id);
    }
    getEventById(id) {
        return this.sitesService.getEventById(id);
    }
    getSiteById(id) {
        return this.sitesService.getSiteById(id);
    }
    deleteSite(id, user) {
        return this.sitesService.deleteSite(id);
    }
    createEvent(createEventDto, user) {
        return this.sitesService.createEvent(createEventDto, user._id);
    }
    updateEvent(id, createEventDto, user) {
        return this.sitesService.updateEvent(id, createEventDto, user._id);
    }
    updateEventTicket(id, createEventArrayDto, user) {
        return this.sitesService.addTickets(id, createEventArrayDto, user._id);
    }
    addTickets(id, updateEventTicketDto, user) {
        return this.sitesService.updateTicket(id, updateEventTicketDto, user._id);
    }
    deleteEvent(id, user) {
        return this.sitesService.deleteEvent(id, user._id);
    }
    deleteTickets(id, user) {
        return this.sitesService.deleteTickets(id, user._id);
    }
};
exports.SitesController = SitesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a site' }),
    (0, swagger_1.ApiBody)({ type: create_site_dto_1.CreateSiteDto }),
    (0, swagger_1.ApiCreatedResponse)({ type: sites_schema_1.Site }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.FUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_site_dto_1.CreateSiteDto, Object]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "createSite", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all sites' }),
    (0, swagger_1.ApiQuery)({ name: 'search', description: 'Search term', required: false }),
    (0, swagger_1.ApiOkResponse)({ type: [sites_schema_1.Site] }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "getAllSites", null);
__decorate([
    (0, common_1.Put)('/:id/request'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve/Reject Request of a site' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Site id' }),
    (0, swagger_1.ApiQuery)({ name: 'status', description: 'Request status' }),
    (0, swagger_1.ApiOkResponse)({ type: sites_schema_1.Site }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.FUser)()),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "requestSite", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('/events'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all events for a site' }),
    (0, swagger_1.ApiQuery)({ name: 'siteId', description: 'Site id', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', description: 'Request status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', description: 'Search term', required: false }),
    (0, swagger_1.ApiOkResponse)({ type: [event_schema_1.Event] }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, user_decorator_1.FUser)()),
    __param(1, (0, common_1.Query)('siteId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Get)('/employees'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all employees for a site' }),
    (0, swagger_1.ApiOkResponse)({ type: [user_decorator_1.FUser] }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, user_decorator_1.FUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "getEmployees", null);
__decorate([
    (0, common_1.Get)('/event/:id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get an event by id' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Event id' }),
    (0, swagger_1.ApiOkResponse)({ type: event_schema_1.Event }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "getEventById", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a site by id' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Site id' }),
    (0, swagger_1.ApiOkResponse)({ type: sites_schema_1.Site }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "getSiteById", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a site by id' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Site id' }),
    (0, swagger_1.ApiOkResponse)({ type: sites_schema_1.Site }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.FUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "deleteSite", null);
__decorate([
    (0, common_1.Post)('/event'),
    (0, swagger_1.ApiOperation)({ summary: 'Create an event for a site' }),
    (0, swagger_1.ApiBody)({ type: create_events_dto_1.CreateEventDto }),
    (0, swagger_1.ApiCreatedResponse)({ type: event_schema_1.Event }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.FUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_events_dto_1.CreateEventDto, Object]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Put)('/event/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an event by id' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Event id' }),
    (0, swagger_1.ApiBody)({ type: create_events_dto_1.CreateEventDto }),
    (0, swagger_1.ApiOkResponse)({ type: event_schema_1.Event }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.FUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_events_dto_1.CreateEventDto, Object]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "updateEvent", null);
__decorate([
    (0, common_1.Post)('/event/:id/ticket'),
    (0, swagger_1.ApiOperation)({ summary: 'Add tickets for an event' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Event id' }),
    (0, swagger_1.ApiBody)({ type: [create_event_tickets_dto_1.CreateEventTicketDto] }),
    (0, swagger_1.ApiCreatedResponse)({ type: event_schema_1.Event }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.FUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "updateEventTicket", null);
__decorate([
    (0, common_1.Put)('/event/:id/ticket'),
    (0, swagger_1.ApiOperation)({ summary: 'Edit tickets for an event' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Event id' }),
    (0, swagger_1.ApiBody)({ type: [create_event_tickets_dto_1.CreateEventTicketDto] }),
    (0, swagger_1.ApiCreatedResponse)({ type: event_schema_1.Event }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.FUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_event_tickets_dto_1.CreateEventTicketDto, Object]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "addTickets", null);
__decorate([
    (0, common_1.Delete)('/event/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an event by id' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Event id' }),
    (0, swagger_1.ApiOkResponse)({ type: event_schema_1.Event }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.FUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "deleteEvent", null);
__decorate([
    (0, common_1.Delete)('/event/:id/ticket'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete tickets for an event' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Event id' }),
    (0, swagger_1.ApiOkResponse)({ type: event_schema_1.Event }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.FUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SitesController.prototype, "deleteTickets", null);
exports.SitesController = SitesController = __decorate([
    (0, common_1.Controller)('sites'),
    (0, swagger_1.ApiTags)('Sites'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, secure_decorator_1.UserSecure)(),
    __metadata("design:paramtypes", [sites_service_1.SitesService])
], SitesController);
//# sourceMappingURL=sites.controller.js.map