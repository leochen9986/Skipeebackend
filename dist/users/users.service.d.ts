/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRequests } from './schemas/user-request';
import { EmailService } from 'src/email/email.service';
export declare class UsersService {
    private readonly userModel;
    private readonly userRequestModel;
    private readonly emailService;
    constructor(userModel: Model<User>, userRequestModel: Model<UserRequests>, emailService: EmailService);
    updateMyProfile(userId: string, updateUserDto: UpdateUserDto): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteUser(userId: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getUser(userId: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    requestUser(email: string, organizerName: string): Promise<string>;
    getUserRequests(): Promise<(import("mongoose").Document<unknown, {}, UserRequests> & UserRequests & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    approveUserRequest(id: string): Promise<import("mongoose").Document<unknown, {}, UserRequests> & UserRequests & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getUserRequest(email: string): import("mongoose").Query<import("mongoose").Document<unknown, {}, UserRequests> & UserRequests & {
        _id: import("mongoose").Types.ObjectId;
    }, import("mongoose").Document<unknown, {}, UserRequests> & UserRequests & {
        _id: import("mongoose").Types.ObjectId;
    }, {}, UserRequests, "findOne">;
}
