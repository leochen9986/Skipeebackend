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
exports.EventTicketSchema = exports.EventTicket = exports.ticketType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
var ticketType;
(function (ticketType) {
    ticketType["QUEUESKIP"] = "queue";
    ticketType["ENTRYTICKET"] = "entry";
})(ticketType || (exports.ticketType = ticketType = {}));
let EventTicket = class EventTicket {
};
exports.EventTicket = EventTicket;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'General Ticket', description: 'Name of the ticket' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EventTicket.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '10', description: 'Total quantity of ticket' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EventTicket.prototype, "totalQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '10', description: 'Available quantity of ticket' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EventTicket.prototype, "availableQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '10', description: 'Price of ticket' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EventTicket.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'queue', description: 'Type of ticket' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EventTicket.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event of ticket' }),
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'Event' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], EventTicket.prototype, "event", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Site of ticket' }),
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'Site' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], EventTicket.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sale Start time of ticket' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], EventTicket.prototype, "saleStartTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sale End time of ticket' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], EventTicket.prototype, "saleEndTime", void 0);
exports.EventTicket = EventTicket = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], EventTicket);
exports.EventTicketSchema = mongoose_1.SchemaFactory.createForClass(EventTicket);
//# sourceMappingURL=event-ticket.schema.js.map