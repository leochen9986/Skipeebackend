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
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sites_schema_1 = require("../sites/schemas/sites.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const stripe_1 = require("stripe");
const email_service_1 = require("../email/email.service");
let StripeService = class StripeService {
    constructor(siteModel, userModel, emailService) {
        this.siteModel = siteModel;
        this.userModel = userModel;
        this.emailService = emailService;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2024-06-20',
        });
    }
    async setStripeCommission(siteId, commissionDto) {
        const site = await this.siteModel.findById(siteId);
        if (!site) {
            throw new common_1.HttpException('Site not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (commissionDto.minCommission !== undefined) {
            site.minCommission = commissionDto.minCommission;
        }
        if (commissionDto.maxCommission !== undefined) {
            site.maxCommission = commissionDto.maxCommission;
        }
        if (commissionDto.percentageCommission !== undefined) {
            site.percentageCommission = commissionDto.percentageCommission;
        }
        if (commissionDto.baseCommission !== undefined) {
            site.baseCommission = commissionDto.baseCommission;
        }
        if (commissionDto.skipping !== undefined) {
            site.skipping = commissionDto.skipping;
        }
        if (commissionDto.ticketing !== undefined) {
            site.ticketing = commissionDto.ticketing;
        }
        if (site.minCommission > site.maxCommission) {
            throw new common_1.HttpException('Minimum commission cannot be greater than maximum commission', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            await site.save();
            return site;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to update commission and settings', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createOrGetStripeAccount(userId) {
        const user = await this.userModel.findById(userId);
        const site = await this.siteModel.findById(user.worksIn);
        if (!site) {
            throw new common_1.HttpException('Site not found', common_1.HttpStatus.NOT_FOUND);
        }
        let dashboardLink = null;
        if (site.stripeAccountId) {
            const accountLink = await this.createAccountLink(site.stripeAccountId);
            const account = await this.stripe.accounts.retrieve(site.stripeAccountId);
            const canAcceptPayments = account.details_submitted &&
                account.charges_enabled &&
                account.payouts_enabled &&
                account.requirements.currently_due.length === 0;
            if (canAcceptPayments)
                dashboardLink = await this.getStripeDashboardLink(site.stripeAccountId);
            return { canAcceptPayments, account, accountLink, dashboardLink };
        }
        const account = await this.stripe.accounts.create({
            type: 'express',
            email: site.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });
        site.stripeAccountId = account.id;
        await site.save();
        const accountLink = await this.createAccountLink(account.id);
        const canAcceptPayments = account.details_submitted &&
            account.charges_enabled &&
            account.payouts_enabled &&
            account.requirements.currently_due.length === 0;
        if (canAcceptPayments)
            dashboardLink = await this.getStripeDashboardLink(account.id);
        return { canAcceptPayments, account, accountLink, dashboardLink };
    }
    async getStripeDashboardLink(accoutnId) {
        const link = await this.stripe.accounts.createLoginLink(accoutnId);
        return link.url;
    }
    async createAccountLink(accountId) {
        const link = await this.stripe.accountLinks.create({
            account: accountId,
            refresh_url: `https://skipee-web-3xdw.vercel.app//#/manage-account`,
            return_url: `https://skipee-web-3xdw.vercel.app//#/manage-account`,
            type: 'account_onboarding',
        });
        return link.url;
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(sites_schema_1.Site.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        email_service_1.EmailService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map