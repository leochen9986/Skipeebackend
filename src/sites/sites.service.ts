import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import mongoose, { Model,Types  } from 'mongoose';
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

    // if (ownedSite) {
    //   throw new HttpException(
    //     'You already have a site',
    //     HttpStatus.NOT_ACCEPTABLE,
    //   );
    // }

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


  async getPaginatedSites(
    search: string,
    archived?: boolean,
    skipping?: boolean,
    ticketing?: boolean,
    ownerId?: string,
    pageNumber: number = 1,
    limitNumber: number = 10,
  ) {
    const filter: any = {};

    if (archived !== undefined) {
      filter.archived = archived;
    } else {
      filter.archived = false; // Default to non-archived sites
    }

    if (skipping !== undefined) {
      filter.skipping = skipping;
    }

    if (ticketing !== undefined) {
      filter.ticketing = ticketing;
    }

    if (search) {
      filter.name = new RegExp(search, 'i');
    }

    if (ownerId) {
      if (!mongoose.Types.ObjectId.isValid(ownerId)) {
        throw new HttpException('Invalid ownerId', HttpStatus.BAD_REQUEST);
      }
      filter.owner = new Types.ObjectId(ownerId);
    }

    const skip = (pageNumber - 1) * limitNumber;

    const sites = await this.siteModel
      .find(filter)
      .populate('owner')
      .skip(skip)
      .limit(limitNumber)
      .exec();

    const totalCount = await this.siteModel.countDocuments(filter);

    const totalPages = Math.ceil(totalCount / limitNumber);

    return {
      sites,
      totalCount,
      currentPage: pageNumber,
      totalPages,
    };
  }


  async archiveSite(siteId: string, userId: string): Promise<Site> {
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
      throw new HttpException('Invalid site ID', HttpStatus.BAD_REQUEST);
    }

    const site = await this.siteModel.findById(siteId);
    if (!site) {
      throw new HttpException('Site not found', HttpStatus.NOT_FOUND);
    }

    // Optional: Check if the user is authorized to archive the site
    // For example, only the owner or an admin can archive the site
    // if (site.owner.toString() !== userId.toString()) {
    //   throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    // }

    site.archived = true;
    await site.save();

    return site;
  }
  

  async getAllSites(search: string, archived?: boolean, skipping?: boolean, ticketing?:boolean, ownerId?: string, ) {
    const filter: any = {};
    console.log("heyyy");
  
    if (archived !== undefined) {
      filter.archived = archived;
    } else {
      filter.archived = false; // Default to non-archived sites
    }
    console.log(skipping);
  
    if (skipping !== undefined) {
      filter.skipping = skipping;  // Add skipping filter
    }
    else{
      if (ticketing !== undefined) {
        filter.ticketing = ticketing;  // Add ticketing filter
      }
    }


    if (search) {
      filter.name = new RegExp(search, 'i');
    }
  
    if (ownerId) {
      if (!mongoose.Types.ObjectId.isValid(ownerId)) {
        throw new HttpException('Invalid ownerId', HttpStatus.BAD_REQUEST);
      }
      filter.owner = new Types.ObjectId(ownerId); // Use Types.ObjectId for consistency
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
  
    const site = await this.siteModel.findById(siteId);
  
    if (!site) {
      throw new HttpException('Site not found', HttpStatus.NOT_FOUND);
    }
  
    if (!site.approved) {
      throw new HttpException('Your venue is still in review', HttpStatus.NOT_ACCEPTABLE);
    }

    if (!site.stripeAccountId) {
      throw new HttpException('Stripe account is not set up for this site', HttpStatus.NOT_ACCEPTABLE);
    }
  
    // Check if the image field is empty and set a default value if necessary
    const image = createEventDto.image && createEventDto.image.trim() !== ''
      ? createEventDto.image
      : 'https://firebasestorage.googleapis.com/v0/b/skipee-ba66f.appspot.com/o/event-images%2Flogo.png?alt=media&token=e2db1b1c-f6c9-46cc-9a35-faba6e31ddb1'; // Use your default image URL here
  
    const createdEvent = new this.eventModel({
      ...createEventDto,
      image, // Assign the image with a default if necessary
      owner: owner._id,
      site: site._id,
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
  
    // if (user.role === 'manager' && user.worksIn !== event.site) {
    //   throw new HttpException(
    //     'You do not have permission to update events',
    //     HttpStatus.NOT_ACCEPTABLE,
    //   );
    // }
  
    // Check if the image field is empty and set a default value if necessary
    const image = createEventDto.image && createEventDto.image.trim() !== ''
      ? createEventDto.image
      : event.image || 'https://firebasestorage.googleapis.com/v0/b/skipee-ba66f.appspot.com/o/event-images%2Flogo.png?alt=media&token=e2db1b1c-f6c9-46cc-9a35-faba6e31ddb1'; // Default URL if no previous image
  
    const updatedData = {
      ...createEventDto,
      image, // Assign the image with a default if necessary
    };
  
    const result = await this.eventModel.findByIdAndUpdate(id, updatedData, {
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

  async addTicket(
    eventId: string,
    createEventTicketDto: CreateEventTicketDto,
    userId: string,
  ) {
    // Fetch the user
    const user = await this.usersService.getUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  
    // Fetch the event
    const event = await this.eventModel.findById(eventId).populate('owner').populate('site');
    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }
  
    // Check if the user is the owner of the event
    if (event.owner._id.toString() !== user._id.toString()) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  
    // Create the ticket data
    const ticketData = {
      ...createEventTicketDto,
      site: event.site._id,
      event: event._id,
      availableQuantity: createEventTicketDto.totalQuantity,
    };
  
    // Create and save the ticket
    const ticket = new this.eventTicketModel(ticketData);
    const savedTicket = await ticket.save();
    if (!savedTicket) {
      throw new HttpException('Failed to add ticket', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  
    // Add the ticket to the event
    event.tickets.push(savedTicket._id);
    event.status = eventStatus.UPCOMING; // Update event status if necessary
    await event.save();
  
    // Return the saved ticket
    return savedTicket;
  }

  async updateTicket(
    ticketId: string,
    updateEventTicketDto: CreateEventTicketDto,
    userId: any,
  ) {
    // Fetch the ticket by ticketId
    const eventTicket = await this.eventTicketModel
      .findById(ticketId)
      .populate('event');
  
    // Validate permissions and existence
    if (!eventTicket || !eventTicket.event) {
      throw new HttpException('Ticket or event not found', HttpStatus.NOT_FOUND);
    }
  
    // Additional logic...
  
    // Update the ticket
    const result = await this.eventTicketModel.findByIdAndUpdate(
      ticketId,
      updateEventTicketDto,
      { new: true },
    );
  
    // Return the updated ticket
    return result;
  }

  async getSitesOwnedByUser(userId: string) {
    return this.siteModel.find({ owner: userId });
  }

  async getEvents(siteId: string, siteIds: string[], status: string[] | string, search: string, user: any) {
    const now = new Date().setHours(0, 0, 0, 0);
  
    // Update past events to COMPLETED if their date has passed and they’re not already completed
    await this.eventModel.updateMany(
      {
        date: { $lt: now },
        endDate: null,
        status: { $ne: eventStatus.COMPLETED },
      },
      { $set: { status: eventStatus.COMPLETED } }
    );
  
    const matchConditions: any = {};
  
    // Build initial match conditions
    if (siteId) {
      matchConditions['site'] = new mongoose.Types.ObjectId(siteId);
    } else if (siteIds && siteIds.length > 0) {
      matchConditions['site'] = { $in: siteIds.map((id) => new mongoose.Types.ObjectId(id)) };
    }
    console.log(status);
   console.log(Array.isArray(status));
   if (status) {
    // Check if status is a string, split it into an array
    if (typeof status === 'string') {
      const statusArray = status.split(',').map(item => item.trim());
      matchConditions['status'] = { $in: statusArray };
    } else {
      matchConditions['status'] = Array.isArray(status) ? { $in: status } : status;
    }
  }
  
    const pipeline: any[] = [];
  
    // Add initial match stage if there are conditions
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }
  
    // Perform $lookup to join with sites collection
    pipeline.push({
      $lookup: {
        from: 'sites',          // Name of the sites collection
        localField: 'site',
        foreignField: '_id',
        as: 'site'
      }
    });
  
    // Unwind the site array
    pipeline.push({ $unwind: '$site' });
  
    // If there's a search term, match against event name or site name
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      pipeline.push({
        $match: {
          $or: [
            { 'name': searchRegex },       // Event name
            { 'site.name': searchRegex }   // Site name
          ]
        }
      });
    }
  
    // Perform lookup for owner
    pipeline.push({
      $lookup: {
        from: 'users',        // Name of the users collection
        localField: 'owner',
        foreignField: '_id',
        as: 'owner'
      }
    });
  
    // Unwind the owner array
    pipeline.push({ $unwind: '$owner' });
  
    // Perform lookup for tickets
    pipeline.push({
      $lookup: {
        from: 'eventtickets',  // Name of the event tickets collection
        localField: 'tickets',
        foreignField: '_id',
        as: 'tickets'
      }
    });
  
    // Sort the events
    pipeline.push({ $sort: { endDate: -1, date: -1 } });
  
    // Execute the aggregation pipeline
    const events = await this.eventModel.aggregate(pipeline);
  
    if (!events || events.length === 0) {
      return events;
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
    // Step 1: Find all sites where the owner is the current user
    const userOwnedSites = await this.siteModel.find({ owner: userId });
  
    if (!userOwnedSites || userOwnedSites.length === 0) {
      throw new HttpException('No sites found for the given owner', HttpStatus.NOT_FOUND);
    }
  
    // Convert each ObjectId in `siteIds` to a string to match the `worksIn` type in `User` schema
    const siteIds = userOwnedSites.map((site) => site._id.toString());
    console.log(siteIds);
  
    // Step 2: Find all users whose worksIn field matches any of the user's owned site IDs
    const employees = await this.userModel
      .find({
        worksIn: { $in: siteIds },
      })
      .populate('worksIn'); // Populate worksIn field with full site details
  
    return employees;
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
