import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UserSecure } from 'src/auth/decorator/secure.decorator';
import { Public } from 'src/auth/decorator/public.decorator';
import { Site } from './schemas/sites.schema';
import { FUser } from 'src/auth/decorator/user.decorator';
import { CreateEventDto } from './dto/create-events.dto';
import { Event } from './schemas/event.schema';
import { CreateEventTicketDto } from './dto/create-event-tickets.dto';
import { UpdateSiteDto } from './dto/update-site.dto'; // Create this DTO
import { EventTicket } from './schemas/event-ticket.schema';

@Controller('sites')
@ApiTags('Sites')
@ApiBearerAuth()
@UserSecure()
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a site' })
  @ApiBody({ type: CreateSiteDto })
  @ApiCreatedResponse({ type: Site })
  createSite(@Body() createSiteDto: CreateSiteDto, @FUser() user) {
    return this.sitesService.createSite(createSiteDto, user._id);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a site by id' })
  @ApiParam({ name: 'id', description: 'Site id' })
  @ApiBody({ type: UpdateSiteDto }) // Use UpdateSiteDto for validation
  @ApiOkResponse({ type: Site })
  async updateSite(
    @Param('id') id: string,
    @Body() updateSiteDto: UpdateSiteDto,
    @FUser() user,
  ) {
    return this.sitesService.updateSite(id, updateSiteDto, user._id);
  }


  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all sites' })
  @ApiQuery({ name: 'search', description: 'Search term', required: false })
  @ApiQuery({ name: 'archived', description: 'Filter by archived status', required: false })
  @ApiQuery({ name: 'skipping', description: 'Filter by skipping status', required: false }) // Add skipping filter
  @ApiQuery({ name: 'ticketing', description: 'Filter by ticketing status', required: false }) 
  @ApiQuery({ name: 'ownerId', description: 'Filter by owner ID', required: false }) // Add ownerId query parameter
  @ApiOkResponse({ type: [Site] })
  getAllSites(
    @Query('search') search: string,
    @Query('archived') archived: string,
    @Query('skipping') skipping: string,  // Add skipping parameter
    @Query('ticketing') ticketing: string,  // Add skipping parameter
    @Query('ownerId') ownerId: string,
  ) {
    let isArchived: boolean;
    let isSkipping: boolean; // Handle skipping flag
    let isTicketing: boolean;
  
    // Parse archived query parameter
    if (archived === 'true') {
      isArchived = true;
    } else if (archived === 'false') {
      isArchived = false;
    } else {
      isArchived = undefined; // Default to undefined if not provided
    }
  
    // Parse skipping query parameter
    if (skipping === 'true') {
      isSkipping = true;
    } else if (skipping === 'false') {
      isSkipping = false;
    } else {
      isSkipping = undefined; // Default to undefined if not provided
    }

        // Parse skipping query parameter
    if (ticketing === 'true') {
      isTicketing = true;
    } else if (ticketing === 'false') {
      isTicketing = false;
    } else {
      isTicketing = undefined; // Default to undefined if not provided
    }
  
    // Call service method with the skipping filter
    return this.sitesService.getAllSites(search, isArchived, isSkipping, isTicketing, ownerId);
  }

  @Get('/paginated')
  @Public()
  @ApiOperation({ summary: 'Get paginated and filtered sites' })
  @ApiQuery({ name: 'search', description: 'Search term', required: false })
  @ApiQuery({ name: 'archived', description: 'Filter by archived status', required: false })
  @ApiQuery({ name: 'skipping', description: 'Filter by skipping status', required: false })
  @ApiQuery({ name: 'ticketing', description: 'Filter by ticketing status', required: false })
  @ApiQuery({ name: 'ownerId', description: 'Filter by owner ID', required: false })
  @ApiQuery({ name: 'page', description: 'Page number', required: false })
  @ApiQuery({ name: 'limit', description: 'Items per page', required: false })
  @ApiOkResponse({ type: [Site] })
  getPaginatedSites(
    @Query('search') search: string,
    @Query('archived') archived: string,
    @Query('skipping') skipping: string,
    @Query('ticketing') ticketing: string,
    @Query('ownerId') ownerId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    let isArchived: boolean;
    let isSkipping: boolean;
    let isTicketing: boolean;

    // Parse boolean query parameters
    if (archived === 'true') {
      isArchived = true;
    } else if (archived === 'false') {
      isArchived = false;
    }

    if (skipping === 'true') {
      isSkipping = true;
    } else if (skipping === 'false') {
      isSkipping = false;
    }

    if (ticketing === 'true') {
      isTicketing = true;
    } else if (ticketing === 'false') {
      isTicketing = false;
    }

    // Parse pagination parameters with defaults
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    return this.sitesService.getPaginatedSites(
      search,
      isArchived,
      isSkipping,
      isTicketing,
      ownerId,
      pageNumber,
      limitNumber,
    );
  }

  @Put('/:id/archive')
  @ApiOperation({ summary: 'Archive a site' })
  @ApiParam({ name: 'id', description: 'Site id' })
  async archiveSite(@Param('id') id: string, @FUser() user) {
    try {
      return await this.sitesService.archiveSite(id, user._id);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Put('/:id/request')
  @ApiOperation({ summary: 'Approve/Reject Request of a site' })
  @ApiParam({ name: 'id', description: 'Site id' })
  @ApiQuery({ name: 'status', description: 'Request status' })
  @ApiOkResponse({ type: Site })
  requestSite(@Param('id') id: string, @FUser() user, @Query('status') status) {
    return this.sitesService.requestSite(id, status, user._id);
  }
  

  @Put('/:id/upload-logo')
  @ApiOperation({ summary: 'Upload logo for a site' })
  @ApiParam({ name: 'id', description: 'Site id' })
  @ApiOkResponse({ description: 'Logo uploaded successfully' })
  uploadLogo(
    @Param('id') id: string,
    @Body('logo') logo: string,
    @FUser() user,
  ) {
    return this.sitesService.updateLogo(id, logo, user._id);
  }

  @Get('/owned-by-me')
@UserSecure()
@ApiBearerAuth()
async getSitesOwnedByMe(@FUser() user) {
  return this.sitesService.getSitesOwnedByUser(user._id);
}


@Public()
@Get('/events')
@ApiOperation({ summary: 'Get all events for a site' })
@ApiQuery({ name: 'siteId', description: 'Site id', required: false })
@ApiQuery({ name: 'status', description: 'Request status', required: false })
@ApiQuery({ name: 'search', description: 'Search term', required: false })
@ApiQuery({ name: 'siteIds', required: false, isArray: true, type: [String] })
@ApiOkResponse({ type: [Event] })
async getEvents(
  @FUser() user,
  @Query('siteId') siteId: string,
  @Query('siteIds') siteIds: string[],
  @Query('status') status: string[] | string,
  @Query('search') search,
) {
  // Set default status to 'upcoming' if it's empty or not provided
  const resolvedStatus = status && status.length > 0 ? status : 'upcoming';

  // Skip the service call if no valid query parameters are provided
  if (!siteId && (!siteIds || siteIds.length === 0) && !resolvedStatus && !search) {
    return {
      statusCode: 200,
      message: 'No query parameters provided, returning empty events list',
      events: [],
    };
  }

  // Pass the parameters to the service if valid
  return this.sitesService.getEvents(siteId, siteIds, resolvedStatus, search, user);
}

  @Get('/employees')
  @ApiOperation({ summary: 'Get all employees for a site' })
  @ApiOkResponse({ type: [FUser] })
  getEmployees(@FUser() user) {
    return this.sitesService.getEmployees(user._id);
  }

  @Get('/event/:id')
  @Public()
  @ApiOperation({ summary: 'Get an event by id' })
  @ApiParam({ name: 'id', description: 'Event id' })
  @ApiOkResponse({ type: Event })
  getEventById(@Param('id') id: string) {
    return this.sitesService.getEventById(id);
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Get a site by id' })
  @ApiParam({ name: 'id', description: 'Site id' })
  @ApiOkResponse({ type: Site })
  getSiteById(@Param('id') id: string) {
    return this.sitesService.getSiteById(id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a site by id' })
  @ApiParam({ name: 'id', description: 'Site id' })
  @ApiOkResponse({ type: Site })
  deleteSite(@Param('id') id: string, @FUser() user) {
    return this.sitesService.deleteSite(id);
  }

  @Post('/event')
  @ApiOperation({ summary: 'Create an event for a site' })
  @ApiBody({ type: CreateEventDto })
  @ApiCreatedResponse({ type: Event })
  createEvent(
    @Body() createEventDto: CreateEventDto, 
    @Body('siteId') siteId: string, 
    @FUser() user
  ) {
    console.log('Site ID:', siteId); // Check if siteId is coming through
    return this.sitesService.createEvent(createEventDto, siteId, user._id);
  }

  @Put('/event/:id')
  @ApiOperation({ summary: 'Update an event by id' })
  @ApiParam({ name: 'id', description: 'Event id' })
  @ApiBody({ type: CreateEventDto })
  @ApiOkResponse({ type: Event })
  updateEvent(
    @Param('id') id: string,
    @Body() createEventDto: CreateEventDto,
    @FUser() user,
  ) {
    return this.sitesService.updateEvent(id, createEventDto, user._id);
  }

  @Put('/event/ticket/:id')
  @ApiOperation({ summary: 'Update a ticket by ticket ID' })
  updateEventTicket(
    @Param('id') ticketId: string,
    @Body() updateEventTicketDto: CreateEventTicketDto,
    @FUser() user,
  ) {
    return this.sitesService.updateTicket(ticketId, updateEventTicketDto, user._id);
  }
  

  @Put('/event/:id/ticket')
  @ApiOperation({ summary: 'Edit tickets for an event' })
  @ApiParam({ name: 'id', description: 'Event id' })
  @ApiBody({ type: [CreateEventTicketDto] })
  @ApiCreatedResponse({ type: Event })
  addTickets(
    @Param('id') id: string,
    @Body() updateEventTicketDto: CreateEventTicketDto,
    @FUser() user,
  ) {
    return this.sitesService.updateTicket(id, updateEventTicketDto, user._id);
  }

  @Post('/event/:id/ticket')
  @ApiOperation({ summary: 'Add a ticket for an event' })
  @ApiParam({ name: 'id', description: 'Event id' })
  @ApiBody({ type: CreateEventTicketDto })
  @ApiCreatedResponse({ type: EventTicket })
  addTicket(
    @Param('id') eventId: string,
    @Body() createEventTicketDto: CreateEventTicketDto,
    @FUser() user,
  ) {
    return this.sitesService.addTicket(eventId, createEventTicketDto, user._id);
  }


  @Delete('/event/:id')
  @ApiOperation({ summary: 'Delete an event by id' })
  @ApiParam({ name: 'id', description: 'Event id' })
  @ApiOkResponse({ type: Event })
  deleteEvent(@Param('id') id: string, @FUser() user) {
    return this.sitesService.deleteEvent(id, user._id);
  }

  @Delete('/event/:id/ticket')
  @ApiOperation({ summary: 'Delete tickets for an event' })
  @ApiParam({ name: 'id', description: 'Event id' })
  @ApiOkResponse({ type: Event })
  deleteTickets(@Param('id') id: string, @FUser() user) {
    return this.sitesService.deleteTickets(id, user._id);
  }
}
