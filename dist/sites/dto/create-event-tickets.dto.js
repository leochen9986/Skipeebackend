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
exports.CreateEventTicketDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEventTicketDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, totalQuantity: { required: true, type: () => Number }, price: { required: true, type: () => String }, type: { required: true, type: () => String }, saleStartTime: { required: true, type: () => String }, saleEndTime: { required: true, type: () => String } };
    }
}
exports.CreateEventTicketDto = CreateEventTicketDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the ticket', example: 'General Queue' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventTicketDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total quantity of the ticket', example: '10' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEventTicketDto.prototype, "totalQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Price of the ticket', example: '10' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", String)
], CreateEventTicketDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of the ticket', example: 'queue' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventTicketDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sale start time', example: '2022-01-01 00:00:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventTicketDto.prototype, "saleStartTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sale end time', example: '2022-01-01 00:00:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventTicketDto.prototype, "saleEndTime", void 0);
//# sourceMappingURL=create-event-tickets.dto.js.map