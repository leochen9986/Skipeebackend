import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { Site } from '../sites/schemas/sites.schema'; // Import Site schema
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
    @InjectModel(Site.name) private readonly siteModel: Model<Site>, 
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

  async requestUser(createUserRequestData) {
    const { email } = createUserRequestData;
    const existingUser = await this.userRequestModel.findOne({ email });
  
    if (existingUser) {
      throw new HttpException('User request already exists', HttpStatus.NOT_ACCEPTABLE);
    }
  
    // Check if user already exists in User collection
    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.NOT_ACCEPTABLE);
    }
  
    // Hash the password before saving
    if (createUserRequestData.password) {
      createUserRequestData.password = await bcrypt.hash(createUserRequestData.password, 10);
    }
  
    const newUserRequest = new this.userRequestModel(createUserRequestData);
    await newUserRequest.save();

    await this.emailService.sendEmail(
      email,
      'Thank you for your interest in Skipee',
      'Hey, thank you for your interest in Skipee. Your request has been received. We are reviewing your request. We will reach out to you shortly.',
      `<p>Hey,</p>
      <p>Thank you for your interest in Skipee. Your request has been received with the following info:</p>
      <strong>
        <p>Email: ${email}</p>
        <p>Organizer Name: ${createUserRequestData.organizerName}</p>
        <p>Date: ${new Date().toLocaleString()}</p>
      </strong>
      <p> We are reviewing your request. We will reach out to you shortly.</p> 
      <strong><p>Regards,</p><p>Skipee Team</p> </strong>`,
    );

    await this.emailService.sendEmail(
      'info@skipee.co.uk',
      'New User Request - Skipee - ' + createUserRequestData.organizerName,
      'Hey, a new user join request has been submitted by ' +
      createUserRequestData.organizerName +
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
        <p>Organizer Name: ${createUserRequestData.organizerName}</p>
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
    const userRequest = await this.userRequestModel.findById(id);

    if (!userRequest) {
      throw new Error('User request not found');
    }

    if (userRequest.approved) {
      throw new HttpException('User request already approved', HttpStatus.NOT_ACCEPTABLE);
    }

    // Check if user already exists
    const userExists = await this.userModel.findOne({ email: userRequest.email });
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.NOT_ACCEPTABLE);
    }

    // Create new Site
    const newSite = new this.siteModel({
      name: userRequest.organizerName,
      email: userRequest.email,
      phone: userRequest.phone,
      owner: null, // We'll set the owner after creating the user
      logo: 'https://firebasestorage.googleapis.com/v0/b/skipee-ba66f.appspot.com/o/event-images%2Flogo.png?alt=media&token=e2db1b1c-f6c9-46cc-9a35-faba6e31ddb1', // Set a default or placeholder logo
      location: 'HQ', // Set default or gather from user
      skipping: true, // Default value or as per your logic
      ticketing: false, // Default value or as per your logic
      // Set other fields as necessary
    });

    const savedSite = await newSite.save();

    // Create new user
    const newUser = new this.userModel({
      name: userRequest.name,
      email: userRequest.email,
      password: userRequest.password, // Already hashed
      role: userRequest.role,
      phone: userRequest.phone,
      organizerName: userRequest.organizerName,
      isActive: true,
      lastSeen: new Date(),
      worksIn: savedSite._id, // Assign the site to worksIn
    });

    const savedUser = await newUser.save();

    // Update the site owner to be the newly created user
    savedSite.owner = savedUser._id;
    await savedSite.save();

    // Mark the request as approved
    userRequest.approved = true;
    await userRequest.save();
    // await this.emailService.sendEmail(
    //   updatedUser.email,
    //   'Approved User Request',
    //   'Hey, thank you for your interest in Skipee. Your request has been approves.',
    //   `<p>Hey,</p>
    //   <p>Thank you for your interest in Skipee. Your request has been approved with the following info: </p>
    //   <strong>
    //     <p>Email: ${updatedUser.email}</p>
    //     <p>Organizer Name: ${updatedUser.organizerName}</p>
    //     <p>Approval Date: ${new Date().toLocaleString()}</p>
    //   </strong>
    //   <p>Please create an account now.</p> 
    //    <strong><p>Regards,</p><p>Skipee Team</p> </strong>`,
    // );
    // await this.emailService.sendEmail(
    //   'info@skipee.co.uk',
    //   'Approved User Request - Skipee - ' + updatedUser.organizerName,
    //   'Hey, a user join request has been approved by ' +
    //     updatedUser.organizerName +
    //     ' | Email: ' +
    //     updatedUser.email +
    //     ' | Date: ' +
    //     new Date() +
    //     '.',
    //   `
    //   <p>Hey,</p>
    //   <p>A user join request has been approved with the following details:</p>
    //   <strong>
    //     <p>Email: ${updatedUser.email}</p>
    //     <p>Organizer Name: ${updatedUser.organizerName}</p>
    //     <p>Approval Date: ${new Date().toLocaleString()}</p>
    //   </strong>
    //   <p>Please create an account now.</p>

    //   <strong><p>Regards,</p><p>Skipee Team</p> </strong>
    //   `,
    // );
    return { message: 'User request approved and user created', user: newUser };
  }

  getUserRequest(email: string) {
    return this.userRequestModel.findOne({ email });
  }
}
