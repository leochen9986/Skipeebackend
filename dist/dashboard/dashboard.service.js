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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_ticket_schema_1 = require("../sites/schemas/event-ticket.schema");
const event_schema_1 = require("../sites/schemas/event.schema");
const sites_schema_1 = require("../sites/schemas/sites.schema");
const tickets_schema_1 = require("../tickets/schemas/tickets.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let DashboardService = class DashboardService {
    constructor(userModel, siteModel, ticketModel, eventModel, eventTicketModel) {
        this.userModel = userModel;
        this.siteModel = siteModel;
        this.ticketModel = ticketModel;
        this.eventModel = eventModel;
        this.eventTicketModel = eventTicketModel;
    }
    async parseDate(dateString) {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    }
    async getDashboardData(user, startDate, endDate, siteId) {
        const start = await this.parseDate(startDate);
        const end = await this.parseDate(endDate);
        console.log(start, end);
        let query = {};
        if (user.role !== 'admin') {
            const userSites = await this.siteModel
                .find({ owner: user.worksIn })
                .select('_id');
            const siteIds = userSites.map((site) => site._id);
            query = { site: { $in: siteIds } };
        }
        if (siteId && user.role === 'admin' && siteId !== 'undefined') {
            const selectedSite = await this.siteModel.findById(siteId);
            query = { site: selectedSite._id };
        }
        console.log(query);
        const ticketCount = await this.ticketModel.countDocuments({
            ...query,
            createdAt: { $gte: start, $lte: end },
        });
        const totalAmount = await this.ticketModel.aggregate([
            { $match: { ...query, createdAt: { $gte: start, $lte: end } } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const chartData = await this.ticketModel.aggregate([
            { $match: { ...query, createdAt: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                    amount: { $sum: '$amount' },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const topCustomers = await this.ticketModel.aggregate([
            { $match: { ...query, createdAt: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: '$phone',
                    totalTickets: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    name: { $first: '$name' },
                },
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 5 },
        ]);
        return {
            ticketCount,
            totalAmount: totalAmount[0]?.total || 0,
            chartData,
            topCustomers,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(sites_schema_1.Site.name)),
    __param(2, (0, mongoose_1.InjectModel)(tickets_schema_1.Ticket.name)),
    __param(3, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __param(4, (0, mongoose_1.InjectModel)(event_ticket_schema_1.EventTicket.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map