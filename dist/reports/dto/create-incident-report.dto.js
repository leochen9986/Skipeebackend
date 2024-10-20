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
exports.CreateIncidentReportDTO = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateIncidentReportDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { reportedBy: { required: true, type: () => String }, incidentDate: { required: true, type: () => String }, description: { required: true, type: () => String }, site: { required: true, type: () => String }, investigationNotes: { required: false, type: () => String } };
    }
}
exports.CreateIncidentReportDTO = CreateIncidentReportDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The ID of the user who reported the incident' }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIncidentReportDTO.prototype, "reportedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The date and time of the incident' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIncidentReportDTO.prototype, "incidentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'A description of the incident' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIncidentReportDTO.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Site of incident' }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIncidentReportDTO.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The investigation notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIncidentReportDTO.prototype, "investigationNotes", void 0);
//# sourceMappingURL=create-incident-report.dto.js.map