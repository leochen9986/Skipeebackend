import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Site } from './schemas/sites.schema';
import { CreateSiteDto } from './dto/create-site.dto';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { EventTicket } from './schemas/event-ticket.schema';
import { CreateEventDto } from './dto/create-events.dto';
import { Event, eventStatus } from './schemas/event.schema';
import { CreateEventTicketDto } from './dto/create-event-tickets.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site.name) private readonly siteModel: Model<Site>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(EventTicket.name)
    private readonly eventTicketModel: Model<EventTicket>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly usersService: UsersService,
  ) {}
  async updateLogo(siteId: string, logo: string, userId: string) {
    // Fetch the site and check if the user is the owner
    const site = await this.siteModel.findById(siteId);
    if (!site) {
      throw new HttpException('Site not found', HttpStatus.NOT_FOUND);
    }

    // if (site.owner.toString() !== userId) {
    //   throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    // }

    // Update the logo
    site.logo = logo;
    const updatedSite = await site.save();
    return updatedSite;
  }
  async createSite(createSiteDto: CreateSiteDto, userId: string) {
    const owner = await this.usersService.getUser(userId);

    if (!owner) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const site = await this.siteModel.findOne({
      name: createSiteDto.name,
    });

    if (site) {
      throw new HttpException(
        'Site with this name already exists',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const ownedSite = await this.siteModel.findOne({
      owner: owner._id,
    });

    if (ownedSite && !owner.worksIn) {
      await this.usersService.updateMyProfile(owner._id.toString(), {
        worksIn: ownedSite._id.toString(),
      } as UpdateUserDto);
    }

    if (ownedSite) {
      throw new HttpException(
        'You already have a site',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const createdSite = new this.siteModel({
      ...createSiteDto,
      owner: owner._id,
    });
    const result = await createdSite.save();
    owner.worksIn = result._id;

    await this.usersService.updateMyProfile(owner._id.toString(), {
      worksIn: result._id.toString(),
    } as UpdateUserDto);
    if (!result) {
      throw new Error('Failed to create site');
    }
    return result;
  }
  async getAllSites(search: string, archived?: boolean, skipping?: boolean) {
    const filter: any = {};
  
    if (archived !== undefined) {
      filter.archived = archived;
    } else {
      filter.archived = false; // Default to non-archived sites
    }
  
    if (skipping !== undefined) {
      filter.skipping = skipping;  // Add skipping filter
    }
  
    if (search) {
      filter.name = new RegExp(search, 'i');
    }
  
    const sites = await this.siteModel.find(filter).populate('owner');
  
    if (!sites) {
      throw new HttpException('Failed to get sites', HttpStatus.NOT_FOUND);
    }
  
    return sites;
  }
  async getSiteById(id: string) {
    const site = await this.siteModel.findById(id);
    if (!site) {
      throw new HttpException('Failed to get site', HttpStatus.NOT_FOUND);
    }
    return site;
  }

  async deleteSite(id: string) {
    const site = await this.siteModel.findById(id);
    if (!site) {
      throw new HttpException('Site not found', HttpStatus.NOT_FOUND);
    }
  
    // Set the archived field to true instead of deleting the site
    site.archived = true;
    const updatedSite = await site.save();
  
    return updatedSite;
  }

  async createEvent(createEventDto: CreateEventDto, siteId: string, userId: string) {
    const owner = await this.usersService.getUser(userId);
  
    if (!owner) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    console.log(siteId);
    // Use the provided siteId from the frontend instead of fetching it based on the owner
    const site = await this.siteModel.findById(siteId);
  
    if (!site) {
      throw new HttpException('Site not found', HttpStatus.NOT_FOUND);
    }
  
    if (!site.approved) {
      throw new HttpException('Your venue is still in review', HttpStatus.NOT_ACCEPTABLE);
    }
  
    const createdEvent = new this.eventModel({
      ...createEventDto,
      owner: owner._id,
      site: site._id, // Use the provided siteId
    });
  
    const result = await createdEvent.save();
    if (!result) {
      throw new HttpException('Failed to create event', HttpStatus.NOT_FOUND);
    }
  
    const newEvent = await this.eventModel
      .findById(result._id)
      .populate('site')
      .populate('owner')
      .populate('tickets');
    
    return newEvent;
  }

  async updateEvent(
    id: string,
    createEventDto: CreateEventDto,
    userId: string,
  ) {
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.usersService.getUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.role === 'manager' && user.worksIn !== event.site) {
      throw new HttpException(
        'You do not have permission to update events',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const result = await this.eventModel.findByIdAndUpdate(id, createEventDto, {
      new: true,
    });
    if (!result) {
      throw new HttpException('Failed to update event', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async requestSite(id: string, status: any, _id: any) {
    const user = await this.usersService.getUser(_id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.role !== 'admin') {
      throw new HttpException(
        'Only admins can approve sites',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const site = await this.siteModel.findById(id);
    if (!site) {
      throw new HttpException('Site not found', HttpStatus.NOT_FOUND);
    }

    site.approved = status;
    const result = await site.save();
    if (!result) {
      throw new HttpException('Failed to update site', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async addTickets(
    id: string,
    createEventArrayDto: [CreateEventTicketDto],
    userId: any,
  ) {
    const user = await this.usersService.getUser(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const event = await (
      await (
        await (await this.eventModel.findById(id)).populate('tickets')
      ).populate('owner')
    ).populate('site');

    if (
      !event ||
      !event.owner ||
      event.owner._id.toString() !== user._id.toString()
    ) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }

    const ticketsBody = createEventArrayDto.map((ticket) => {
      return {
        ...ticket,
        site: event.site._id,
        event: event._id,
        availableQuantity: ticket.totalQuantity,
      };
    });
    const tickets = await this.eventTicketModel.insertMany(ticketsBody);
    if (!tickets) {
      throw new HttpException('Failed to add tickets', HttpStatus.NOT_FOUND);
    }

    event.tickets = [
      ...event.tickets.map((ticket) => ticket._id),
      ...tickets.map((ticket) => ticket._id),
    ];
    event.status = eventStatus.UPCOMING;

    const result = await event.save();
    if (!result) {
      throw new HttpException('Failed to add tickets', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async updateTicket(
    id: string,
    updateEventTicketDto: CreateEventTicketDto,
    userId: any,
  ) {
    const user = await this.usersService.getUser(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const eventTicket = await this.eventTicketModel
      .findById(id)
      .populate('event');

    if (
      !eventTicket.event ||
      !(eventTicket.event as any).owner ||
      (eventTicket.event as any).owner._id.toString() !== user._id.toString()
    ) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }

    const result = await this.eventTicketModel.findByIdAndUpdate(id, {
      ...updateEventTicketDto,
      availableQuantity:
        updateEventTicketDto.totalQuantity -
        parseInt(eventTicket.totalQuantity) +
        parseInt(eventTicket.availableQuantity),
    });
    if (!result) {
      throw new HttpException('Failed to update tickets', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async getEvents(siteId: string, siteIds: string[], status: string[] | string, search: string, user: any) {

    const filter: any = {};
    

    if (siteId) {
      filter['site'] = new mongoose.Types.ObjectId(siteId);
    } else if (siteIds && siteIds.length > 0) {
      filter['site'] = { $in: siteIds.map((id) => new mongoose.Types.ObjectId(id)) };
    }
  

    if (status) {
      if (Array.isArray(status)) {
        filter.status = { $in: status };
      } else {
        filter.status = status;
      }
    }
  
    if (search) {
      filter['name'] = new RegExp(search, 'i');
    }

    // console.log(filter);
    const now = new Date().setHours(0, 0, 0, 0);

    await this.eventModel.updateMany(
      {
        date: { $lt: now },
        endDate: null,
        status: { $ne: eventStatus.COMPLETED },
      },
      { $set: { status: eventStatus.COMPLETED } },
    );
    await this.eventModel.updateMany(
      {
        date: { $gte: now },
        status: { $ne: eventStatus.DRAFT },
      },
      { $set: { status: eventStatus.UPCOMING } },
    );

    const events = await this.eventModel
      .find(filter)
      .populate('site')
      .populate('owner')
      .populate('tickets')
      .sort({ endDate: -1, date: -1 });
    if (!events) {
      throw new HttpException('Failed to get events', HttpStatus.NOT_FOUND);
    }
    return events;
  }

  async getEventById(id: string) {
    const event = await this.eventModel
      .findById(id)
      .populate('site')
      .populate('owner')
      .populate('tickets');
    if (!event) {
      throw new HttpException('Failed to get event', HttpStatus.NOT_FOUND);
    }
    return event;
  }

  async getEmployees(userId: string) {
    const user = await this.usersService.getUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.worksIn || user.worksIn === null) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const allUsersForSite = await this.userModel.find({
      worksIn: user.worksIn._id.toString(),
    });
    return allUsersForSite;
  }

  async deleteEvent(id: string, userId: string) {
    const user = await this.usersService.getUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.worksIn || user.worksIn === null) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const result = await this.eventModel.findByIdAndDelete(id);
    if (!result) {
      throw new HttpException('Failed to delete event', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async deleteTickets(id: string, userId: string) {
    const user = await this.usersService.getUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.worksIn || user.worksIn === null) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const result = await this.eventTicketModel.findByIdAndDelete(id);
    if (!result) {
      throw new HttpException('Failed to delete tickets', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
