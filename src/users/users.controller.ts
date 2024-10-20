import { Controller, Delete, Get, Patch, Body, Param, Post, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { FUser } from 'src/auth/decorator/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOkResponse, ApiOperation, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UserSecure } from 'src/auth/decorator/secure.decorator';
import { User } from './schemas/user.schema';
import { UserRequests, UserRequestsSchema } from './schemas/user-request';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UserSecure()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get my profile',
  })
  @ApiOkResponse({
    description: 'User profile',
    type: User,
  })
  getMyProfile(@FUser() user) {
    return this.usersService.getUser(user._id);
  }

  @Patch()
  @ApiOperation({
    summary: 'Update my profile',
  })
  @ApiBody({
    type: UpdateUserDto,
    required: true,
    description: 'User data to update',
  })
  @ApiOkResponse({
    description: 'Updated user profile',
    type: User,
  })
  updateMyProfile(@FUser() user, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateMyProfile(user._id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user by id',
  })
  @ApiOkResponse({
    description: 'User deleted',
    type: UserSecure,
  })
  @ApiParam({
    name: 'id',
    description: 'User id',
    type: String,
    required: true,
  })
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete my profile',
  })
  @ApiOkResponse({
    description: 'User deleted',
    type: UserSecure,
  })
  deleteMyProfile(@FUser() user) {
    return this.usersService.deleteUser(user._id);
  }

  @Public()
  @Post('/request')
  @ApiOperation({
    summary: 'Request user',
  })
  @ApiOkResponse({
    description: 'User join requested',
    type: UserRequests,
  })
  @ApiBody({
    type: String,
    required: true,
    description: 'User email to request',
  })
  requestUser(@Body('email') email: string, @Body('organizerName') organizerName: string) {
    return this.usersService.requestUser(email, organizerName);
  }

  @Get('/request')
  @ApiOperation({
    summary: 'Get user requests',
  })
  @ApiOkResponse({
    description: 'User join requests',
    type: [UserRequests],
  })
  getUserRequests(@FUser() user) {
    if(user.role === 'admin') return this.usersService.getUserRequests();
    return new HttpException('Unauthorized', 401);
  }


  @Get('/approve-request/:id')
  @ApiOperation({
    summary: 'Approve user join request',
  })
  @ApiOkResponse({
    description: 'User join approved',
    type: UserRequests,
  })
  @ApiParam({
    name: 'id',
    description: 'User join request id',
    type: String,
    required: true,
  })
  async approveUserRequest(@Param('id') id: string, @FUser() user) {
    if(user.role === 'admin') return this.usersService.approveUserRequest(id);
    return new HttpException('Unauthorized', 401);
  }



}


