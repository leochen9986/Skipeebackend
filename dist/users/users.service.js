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
const mongoose_2 = require("@nestjs/mongoose");
const user_request_1 = require("./schemas/user-request");
const email_service_1 = require("../email/email.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(userModel, userRequestModel, emailService) {
        this.userModel = userModel;
        this.userRequestModel = userRequestModel;
        this.emailService = emailService;
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
    async requestUser(email, organizerName) {
        const user = await this.userRequestModel.findOne({ email });
        if (user) {
            throw new common_1.HttpException('User already exists', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const createdUser = new this.userRequestModel({ email });
        await createdUser.save();
        await this.emailService.sendEmail(email, 'Thank you for your interest in Skipee', 'Hey, thank you for your interest in Skipee. Your request has been received. We are reviewing your request. We will reach out to you shortly.', `<p>Hey,</p>
      <p>Thank you for your interest in Skipee. Your request has been received with the following info:</p>
      <strong>
        <p>Email: ${email}</p>
        <p>Organizer Name: ${organizerName}</p>
        <p>Date: ${new Date().toLocaleString()}</p>
      </strong>
      <p> We are reviewing your request. We will reach out to you shortly.</p> 
      <strong><p>Regards,</p><p>Skipee Team</p> </strong>`);
        await this.emailService.sendEmail('info@skipee.co.uk', 'New User Request - Skipee - ' + organizerName, 'Hey, a new user join request has been submitted by ' +
            organizerName +
            ' | Email: ' +
            email +
            ' | Date: ' +
            new Date() +
            '.', `
      <p>Hey,</p>
      <p>A new user join request has been submitted with the following details:</p>
      <strong>
        <p>Email: ${email}</p>
        <p>Organizer Name: ${organizerName}</p>
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
        const updatedUser = await this.userRequestModel.findByIdAndUpdate(id, { approved: true }, { new: true });
        if (!updatedUser) {
            throw new Error('Failed to approve user request');
        }
        await this.emailService.sendEmail(updatedUser.email, 'Approved User Request', 'Hey, thank you for your interest in Skipee. Your request has been approves.', `<p>Hey,</p>
      <p>Thank you for your interest in Skipee. Your request has been approved with the following info: </p>
      <strong>
        <p>Email: ${updatedUser.email}</p>
        <p>Organizer Name: ${updatedUser.organizerName}</p>
        <p>Approval Date: ${new Date().toLocaleString()}</p>
      </strong>
      <p>Please create an account now.</p> 
       <strong><p>Regards,</p><p>Skipee Team</p> </strong>`);
        await this.emailService.sendEmail('info@skipee.co.uk', 'Approved User Request - Skipee - ' + updatedUser.organizerName, 'Hey, a user join request has been approved by ' +
            updatedUser.organizerName +
            ' | Email: ' +
            updatedUser.email +
            ' | Date: ' +
            new Date() +
            '.', `
      <p>Hey,</p>
      <p>A user join request has been approved with the following details:</p>
      <strong>
        <p>Email: ${updatedUser.email}</p>
        <p>Organizer Name: ${updatedUser.organizerName}</p>
        <p>Approval Date: ${new Date().toLocaleString()}</p>
      </strong>
      <p>Please create an account now.</p>

      <strong><p>Regards,</p><p>Skipee Team</p> </strong>
      `);
        return updatedUser;
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
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        email_service_1.EmailService])
], UsersService);
//# sourceMappingURL=users.service.js.map