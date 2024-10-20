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
exports.TicketsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const tickets_services_1 = require("./tickets.services");
const swagger_1 = require("@nestjs/swagger");
const create_ticket_dto_1 = require("./dto/create-ticket.dto");
const public_decorator_1 = require("../auth/decorator/public.decorator");
const secure_decorator_1 = require("../auth/decorator/secure.decorator");
const user_decorator_1 = require("../auth/decorator/user.decorator");
let TicketsController = class TicketsController {
    constructor(ticketsService) {
        this.ticketsService = ticketsService;
    }
    getTickets(user) {
        return this.ticketsService.getAllTickets(user);
    }
    getTicket(id) {
        return this.ticketsService.getTickets(id);
    }
    getTicketFromticketsType(id) {
        return this.ticketsService.getTicketFromticketsType(id);
    }
    approveTicket(id, quantity) {
        return this.ticketsService.approveTicket(id, quantity);
    }
    confirmTicket(id) {
        return this.ticketsService.confirmTicket(id);
    }
    createTicket(createTicketDto) {
        return this.ticketsService.createTicket(createTicketDto);
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Get)(),
    (0, secure_decorator_1.UserSecure)(),
    (0, swagger_1.ApiBearerAuth)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, user_decorator_1.FUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "getTickets", null);
__decorate([
    (0, common_1.Get)('/:id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "getTicket", null);
__decorate([
    (0, common_1.Get)('/tickets-type/:id'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "getTicketFromticketsType", null);
__decorate([
    (0, common_1.Get)('/approve/:id/:quantiy'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('quantiy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "approveTicket", null);
__decorate([
    (0, common_1.Get)('/confirm/:id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "confirmTicket", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ticket_dto_1.CreateTicketDto]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "createTicket", null);
exports.TicketsController = TicketsController = __decorate([
    (0, common_1.Controller)('tickets'),
    (0, swagger_1.ApiTags)('Tickets'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [tickets_services_1.TicketsServices])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map