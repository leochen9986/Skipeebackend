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
exports.CreateEventDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateEventDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, description: { required: true, type: () => String }, image: { required: true, type: () => String }, date: { required: true, type: () => Date }, startTime: { required: true, type: () => Date }, endTime: { required: true, type: () => Date }, location: { required: true, type: () => String }, lastEntryTime: { required: true, type: () => Date }, minAgeLimit: { required: true, type: () => Number }, limitQuantity: { required: false, type: () => Boolean }, singleEvent: { required: false, type: () => Boolean } };
    }
}
exports.CreateEventDto = CreateEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Example Venue',
        description: 'The name of the venue',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'A beautiful venue for events and gatherings',
        description: 'A brief description of the venue',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/venue.jpg',
        description: 'URL of the venue image',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value && value.trim() !== '' ? value : 'https://firebasestorage.googleapis.com/v0/b/skipee-ba66f.appspot.com/o/event-images%2Flogo.png?alt=media&token=e2db1b1c-f6c9-46cc-9a35-faba6e31ddb1'),
    __metadata("design:type", String)
], CreateEventDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2022-01-01T00:00:00.000Z',
        description: 'The date and time of the event',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateEventDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2022-01-01T00:00:00.000Z',
        description: 'The start time of the event',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateEventDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2022-01-01T00:00:00.000Z',
        description: 'The end time of the event',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateEventDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Example Location',
        description: 'The location of the event',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2022-01-01T00:00:00.000Z',
        description: 'The last entry time of the event',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateEventDto.prototype, "lastEntryTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 18,
        description: 'The minimum age limit of the event',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateEventDto.prototype, "minAgeLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "limitQuantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "singleEvent", void 0);
//# sourceMappingURL=create-events.dto.js.map