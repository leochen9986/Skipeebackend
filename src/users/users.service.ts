import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRequests } from './schemas/user-request';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserRequests.name)
    private readonly userRequestModel: Model<UserRequests>,
    private readonly emailService: EmailService,
  ) {}

  async updateMyProfile(userId: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password && updateUserDto.password.length > 7) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .populate('worksIn');
    if (!updatedUser) {
      throw new Error('Failed to update user');
    }
    return updatedUser;
  }

  async deleteUser(userId: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new Error('Failed to delete user');
    }
    return deletedUser;
  }

  async getUser(userId: string) {
    const user = await this.userModel.findById(userId).populate('worksIn');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async requestUser(email: string, organizerName: string) {
    const user = await this.userRequestModel.findOne({ email });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.NOT_ACCEPTABLE);
    }

    const createdUser = new this.userRequestModel({ email });
    await createdUser.save();

    await this.emailService.sendEmail(
      email,
      'Thank you for your interest in Skipee',
      'Hey, thank you for your interest in Skipee. Your request has been received. We are reviewing your request. We will reach out to you shortly.',
      `<p>Hey,</p>
      <p>Thank you for your interest in Skipee. Your request has been received with the following info:</p>
      <strong>
        <p>Email: ${email}</p>
        <p>Organizer Name: ${organizerName}</p>
        <p>Date: ${new Date().toLocaleString()}</p>
      </strong>
      <p> We are reviewing your request. We will reach out to you shortly.</p> 
      <strong><p>Regards,</p><p>Skipee Team</p> </strong>`,
    );

    await this.emailService.sendEmail(
      'info@skipee.co.uk',
      'New User Request - Skipee - ' + organizerName,
      'Hey, a new user join request has been submitted by ' +
        organizerName +
        ' | Email: ' +
        email +
        ' | Date: ' +
        new Date() +
        '.',
      `
      <p>Hey,</p>
      <p>A new user join request has been submitted with the following details:</p>
      <strong>
        <p>Email: ${email}</p>
        <p>Organizer Name: ${organizerName}</p>
        <p>Date: ${new Date().toLocaleString()}</p>
      </strong>
      <p>Please review and approve the request.</p>

      <strong><p>Regards,</p><p>Skipee Team</p> </strong>
      `,
    );

    return 'createdUser';
  }

  async getUserRequests() {
    const userRequests = await this.userRequestModel
      .find()
      .sort({ createdAt: -1 });
    if (!userRequests) {
      throw new Error('Failed to get user requests');
    }
    return userRequests;
  }

  async approveUserRequest(id: string) {
    const updatedUser = await this.userRequestModel.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true },
    );
    if (!updatedUser) {
      throw new Error('Failed to approve user request');
    }
    await this.emailService.sendEmail(
      updatedUser.email,
      'Approved User Request',
      'Hey, thank you for your interest in Skipee. Your request has been approves.',
      `<p>Hey,</p>
      <p>Thank you for your interest in Skipee. Your request has been approved with the following info: </p>
      <strong>
        <p>Email: ${updatedUser.email}</p>
        <p>Organizer Name: ${updatedUser.organizerName}</p>
        <p>Approval Date: ${new Date().toLocaleString()}</p>
      </strong>
      <p>Please create an account now.</p> 
       <strong><p>Regards,</p><p>Skipee Team</p> </strong>`,
    );
    await this.emailService.sendEmail(
      'info@skipee.co.uk',
      'Approved User Request - Skipee - ' + updatedUser.organizerName,
      'Hey, a user join request has been approved by ' +
        updatedUser.organizerName +
        ' | Email: ' +
        updatedUser.email +
        ' | Date: ' +
        new Date() +
        '.',
      `
      <p>Hey,</p>
      <p>A user join request has been approved with the following details:</p>
      <strong>
        <p>Email: ${updatedUser.email}</p>
        <p>Organizer Name: ${updatedUser.organizerName}</p>
        <p>Approval Date: ${new Date().toLocaleString()}</p>
      </strong>
      <p>Please create an account now.</p>

      <strong><p>Regards,</p><p>Skipee Team</p> </strong>
      `,
    );
    return updatedUser;
  }

  getUserRequest(email: string) {
    return this.userRequestModel.findOne({ email });
  }
}
