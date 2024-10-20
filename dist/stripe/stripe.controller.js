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
exports.StripeController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const stripe_service_1 = require("./stripe.service");
const swagger_1 = require("@nestjs/swagger");
const user_decorator_1 = require("../auth/decorator/user.decorator");
const secure_decorator_1 = require("../auth/decorator/secure.decorator");
const stripe_comission_dto_1 = require("./dto/stripe-comission.dto");
let StripeController = class StripeController {
    constructor(stripeService) {
        this.stripeService = stripeService;
    }
    getStripeAccountLink(user) {
        return this.stripeService.createOrGetStripeAccount(user._id.toString());
    }
    setStripeComission(siteId, commissionDto) {
        return this.stripeService.setStripeCommission(siteId, commissionDto);
    }
};
exports.StripeController = StripeController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.FUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StripeController.prototype, "getStripeAccountLink", null);
__decorate([
    (0, common_1.Post)('commission/:id'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, stripe_comission_dto_1.StripeCommissionDto]),
    __metadata("design:returntype", void 0)
], StripeController.prototype, "setStripeComission", null);
exports.StripeController = StripeController = __decorate([
    (0, common_1.Controller)('stripe'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, secure_decorator_1.UserSecure)(),
    __metadata("design:paramtypes", [stripe_service_1.StripeService])
], StripeController);
//# sourceMappingURL=stripe.controller.js.map