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
exports.IncidentReportSchema = exports.IncidentReport = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
let IncidentReport = class IncidentReport {
};
exports.IncidentReport = IncidentReport;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The ID of the user who reported the incident' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], IncidentReport.prototype, "reportedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The date and time of the incident' }),
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], IncidentReport.prototype, "incidentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'A description of the incident' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], IncidentReport.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Site of incident' }),
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'Site' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], IncidentReport.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The investigation notes' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], IncidentReport.prototype, "investigationNotes", void 0);
exports.IncidentReport = IncidentReport = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], IncidentReport);
exports.IncidentReportSchema = mongoose_1.SchemaFactory.createForClass(IncidentReport);
//# sourceMappingURL=report.schema.js.map