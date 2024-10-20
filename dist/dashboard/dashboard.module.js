"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
const dashboard_controller_1 = require("./dashboard.controller");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const sites_schema_1 = require("../sites/schemas/sites.schema");
const tickets_schema_1 = require("../tickets/schemas/tickets.schema");
const event_schema_1 = require("../sites/schemas/event.schema");
const event_ticket_schema_1 = require("../sites/schemas/event-ticket.schema");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: sites_schema_1.Site.name, schema: sites_schema_1.SiteSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: tickets_schema_1.Ticket.name, schema: tickets_schema_1.TicketSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: Event.name, schema: event_schema_1.EventSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: event_ticket_schema_1.EventTicket.name, schema: event_ticket_schema_1.EventTicketSchema }]),
        ],
        providers: [dashboard_service_1.DashboardService],
        controllers: [dashboard_controller_1.DashboardController],
    })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map