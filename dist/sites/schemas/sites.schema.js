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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSchema = exports.Site = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
var Gender;
(function (Gender) {
    Gender["Male"] = "male";
    Gender["Female"] = "female";
})(Gender || (Gender = {}));
let Site = class Site {
};
exports.Site = Site;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the Organization' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Site.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email of the Organization' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Site.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Site.prototype, "skipping", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Site.prototype, "ticketing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contact number of the Organization' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Site.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The logo of the organization' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Site.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Owner of the venue' }),
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Site.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Approved' }),
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Site.prototype, "approved", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Stripe account id' }),
    (0, mongoose_1.Prop)({ required: false, default: null }),
    __metadata("design:type", String)
], Site.prototype, "stripeAccountId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Minimum commission amount' }),
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Site.prototype, "minCommission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum commission amount' }),
    (0, mongoose_1.Prop)({ required: true, default: 100 }),
    __metadata("design:type", Number)
], Site.prototype, "maxCommission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Percentage commission' }),
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Site.prototype, "percentageCommission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base commission amount' }),
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Site.prototype, "baseCommission", void 0);
exports.Site = Site = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Site);
exports.SiteSchema = mongoose_1.SchemaFactory.createForClass(Site);
//# sourceMappingURL=sites.schema.js.map