"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeModule = void 0;
const common_1 = require("@nestjs/common");
const stripe_controller_1 = require("./stripe.controller");
const stripe_service_1 = require("./stripe.service");
const mongoose_1 = require("@nestjs/mongoose");
const sites_schema_1 = require("../sites/schemas/sites.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const email_module_1 = require("../email/email.module");
let StripeModule = class StripeModule {
};
exports.StripeModule = StripeModule;
exports.StripeModule = StripeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: sites_schema_1.Site.name, schema: sites_schema_1.SiteSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
            email_module_1.EmailModule,
        ],
        controllers: [stripe_controller_1.StripeController],
        providers: [stripe_service_1.StripeService],
    })
], StripeModule);
//# sourceMappingURL=stripe.module.js.map