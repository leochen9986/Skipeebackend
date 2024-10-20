import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
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

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all sites' })
  @ApiQuery({ name: 'search', description: 'Search term', required: false })
  @ApiOkResponse({ type: [Site] })
  getAllSites(@Query('search') search) {
    return this.sitesService.getAllSites(search);
  }

  @Put('/:id/request')
  @ApiOperation({ summary: 'Approve/Reject Request of a site' })
  @ApiParam({ name: 'id', description: 'Site id' })
  @ApiQuery({ name: 'status', description: 'Request status' })
  @ApiOkResponse({ type: Site })
  requestSite(@Param('id') id: string, @FUser() user, @Query('status') status) {
    return this.sitesService.requestSite(id, status, user._id);
  }
  

  @Public()
  @Get('/events')
  @ApiOperation({ summary: 'Get all events for a site' })
  @ApiQuery({ name: 'siteId', description: 'Site id', required: false })
  @ApiQuery({ name: 'status', description: 'Request status', required: false })
  @ApiQuery({ name: 'search', description: 'Search term', required: false })
  @ApiOkResponse({ type: [Event] })
  getEvents(
    @FUser() user,
    @Query('siteId') siteId: string,
    @Query('status') status,
    @Query('search') search,
  ) {
    return this.sitesService.getEvents(siteId, status, search, user);
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
  createEvent(@Body() createEventDto: CreateEventDto, @FUser() user) {
    return this.sitesService.createEvent(createEventDto, user._id);
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

  @Post('/event/:id/ticket')
  @ApiOperation({ summary: 'Add tickets for an event' })
  @ApiParam({ name: 'id', description: 'Event id' })
  @ApiBody({ type: [CreateEventTicketDto] })
  @ApiCreatedResponse({ type: Event })
  updateEventTicket(
    @Param('id') id: string,
    @Body() createEventArrayDto: [CreateEventTicketDto],
    @FUser() user,
  ) {
    return this.sitesService.addTickets(id, createEventArrayDto, user._id);
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
