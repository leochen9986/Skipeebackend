"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitesModule = void 0;
const common_1 = require("@nestjs/common");
const sites_controller_1 = require("./sites.controller");
const sites_service_1 = require("./sites.service");
const mongoose_1 = require("@nestjs/mongoose");
const sites_schema_1 = require("./schemas/sites.schema");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
const event_ticket_schema_1 = require("./schemas/event-ticket.schema");
const event_schema_1 = require("./schemas/event.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let SitesModule = class SitesModule {
};
exports.SitesModule = SitesModule;
exports.SitesModule = SitesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: sites_schema_1.Site.name, schema: sites_schema_1.SiteSchema },
                { name: event_schema_1.Event.name, schema: event_schema_1.EventSchema },
                { name: event_ticket_schema_1.EventTicket.name, schema: event_ticket_schema_1.EventTicketSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
        ],
        controllers: [sites_controller_1.SitesController],
        providers: [sites_service_1.SitesService],
    })
], SitesModule);
//# sourceMappingURL=sites.module.js.map