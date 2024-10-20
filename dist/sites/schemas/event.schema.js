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
exports.EventSchema = exports.Event = exports.eventStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
var eventStatus;
(function (eventStatus) {
    eventStatus["DRAFT"] = "draft";
    eventStatus["UPCOMING"] = "upcoming";
    eventStatus["CURRENT"] = "current";
    eventStatus["COMPLETED"] = "completed";
    eventStatus["CANCELLED"] = "cancelled";
})(eventStatus || (exports.eventStatus = eventStatus = {}));
let Event = class Event {
};
exports.Event = Event;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the event' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Event.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The description of the event' }),
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The image of the event' }),
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Event.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The date of the event' }),
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], Event.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The end date of the event' }),
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], Event.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The start time of the event' }),
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Event.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The end time of the event' }),
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Event.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The location of the event' }),
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Event.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The site of the event' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Site', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Event.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The last entry time of the event' }),
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Event.prototype, "lastEntryTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The minimum age limit for the event' }),
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], Event.prototype, "minAgeLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The array of tickets available for the event' }),
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: 'EventTicket', default: [] }),
    __metadata("design:type", Array)
], Event.prototype, "tickets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The owner of the event' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Event.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The status of the event' }),
    (0, mongoose_1.Prop)({ enum: eventStatus, default: eventStatus.DRAFT }),
    __metadata("design:type", String)
], Event.prototype, "status", void 0);
exports.Event = Event = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Event);
exports.EventSchema = mongoose_1.SchemaFactory.createForClass(Event);
//# sourceMappingURL=event.schema.js.map