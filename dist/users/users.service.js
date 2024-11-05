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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_1 = require("mongoose");
const sites_schema_1 = require("../sites/schemas/sites.schema");
const mongoose_2 = require("@nestjs/mongoose");
const user_request_1 = require("./schemas/user-request");
const email_service_1 = require("../email/email.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(userModel, userRequestModel, emailService, siteModel) {
        this.userModel = userModel;
        this.userRequestModel = userRequestModel;
        this.emailService = emailService;
        this.siteModel = siteModel;
    }
    async updateMyProfile(userId, updateUserDto) {
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
    async deleteUser(userId) {
        const deletedUser = await this.userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw new Error('Failed to delete user');
        }
        return deletedUser;
    }
    async getUser(userId) {
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
            throw new common_1.HttpException('User request already exists', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const userExists = await this.userModel.findOne({ email });
        if (userExists) {
            throw new common_1.HttpException('User already exists', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        if (createUserRequestData.password) {
            createUserRequestData.password = await bcrypt.hash(createUserRequestData.password, 10);
        }
        const newUserRequest = new this.userRequestModel(createUserRequestData);
        await newUserRequest.save();
        await this.emailService.sendEmail(email, 'Thank you for your interest in Skipee', 'Hey, thank you for your interest in Skipee. Your request has been received. We are reviewing your request. We will reach out to you shortly.', `<p>Hey,</p>
      <p>Thank you for your interest in Skipee. Your request has been received with the following info:</p>
      <strong>
        <p>Email: ${email}</p>
        <p>Organizer Name: ${createUserRequestData.organizerName}</p>
        <p>Date: ${new Date().toLocaleString()}</p>
      </strong>
      <p> We are reviewing your request. We will reach out to you shortly.</p> 
      <strong><p>Regards,</p><p>Skipee Team</p> </strong>`);
        await this.emailService.sendEmail('info@skipee.co.uk', 'New User Request - Skipee - ' + createUserRequestData.organizerName, 'Hey, a new user join request has been submitted by ' +
            createUserRequestData.organizerName +
            ' | Email: ' +
            email +
            ' | Date: ' +
            new Date() +
            '.', `
      <p>Hey,</p>
      <p>A new user join request has been submitted with the following details:</p>
      <strong>
        <p>Email: ${email}</p>
        <p>Organizer Name: ${createUserRequestData.organizerName}</p>
        <p>Date: ${new Date().toLocaleString()}</p>
      </strong>
      <p>Please review and approve the request.</p>

      <strong><p>Regards,</p><p>Skipee Team</p> </strong>
      `);
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
    async approveUserRequest(id) {
        const userRequest = await this.userRequestModel.findById(id);
        if (!userRequest) {
            throw new Error('User request not found');
        }
        if (userRequest.approved) {
            throw new common_1.HttpException('User request already approved', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const userExists = await this.userModel.findOne({ email: userRequest.email });
        if (userExists) {
            throw new common_1.HttpException('User already exists', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const newSite = new this.siteModel({
            name: userRequest.organizerName,
            email: userRequest.email,
            phone: userRequest.phone,
            owner: null,
            logo: 'https://firebasestorage.googleapis.com/v0/b/skipee-ba66f.appspot.com/o/event-images%2Flogo.png?alt=media&token=e2db1b1c-f6c9-46cc-9a35-faba6e31ddb1',
            location: 'HQ',
            skipping: true,
            ticketing: false,
        });
        const savedSite = await newSite.save();
        const newUser = new this.userModel({
            name: userRequest.name,
            email: userRequest.email,
            password: userRequest.password,
            role: userRequest.role,
            phone: userRequest.phone,
            organizerName: userRequest.organizerName,
            isActive: true,
            lastSeen: new Date(),
            worksIn: savedSite._id,
        });
        const savedUser = await newUser.save();
        savedSite.owner = savedUser._id;
        await savedSite.save();
        userRequest.approved = true;
        await userRequest.save();
        return { message: 'User request approved and user created', user: newUser };
    }
    getUserRequest(email) {
        return this.userRequestModel.findOne({ email });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_2.InjectModel)(user_request_1.UserRequests.name)),
    __param(3, (0, mongoose_2.InjectModel)(sites_schema_1.Site.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        email_service_1.EmailService,
        mongoose_1.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map