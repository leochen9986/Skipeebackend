import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { UserSecure } from 'src/auth/decorator/secure.decorator';
import { EventTicket } from 'src/sites/schemas/event-ticket.schema';
import { Event } from 'src/sites/schemas/event.schema';
import { Site } from 'src/sites/schemas/sites.schema';
import { Ticket } from 'src/tickets/schemas/tickets.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Site.name) private readonly siteModel: Model<Site>,
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(EventTicket.name)
    private readonly eventTicketModel: Model<EventTicket>,
  ) {}

  async parseDate(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed in JavaScript
  }

  async getDashboardData(
    user: any,
    startDate: string,
    endDate: string,
    siteId?: string,
  ) {
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

    // console.log('Ticket count: ' +ticketCount);

    const totalAmount = await this.ticketModel.aggregate([
      { $match: { ...query, createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // console.log('totalAmount: ' +totalAmount[0]?.total);

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
}
