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
import { HydratedDocument, Types } from 'mongoose';
export type EventTicketsDocument = HydratedDocument<EventTicket>;
export declare enum ticketType {
    QUEUESKIP = "queue",
    ENTRYTICKET = "entry"
}
export declare class EventTicket {
    name: string;
    totalQuantity: string;
    availableQuantity: string;
    price: string;
    type: ticketType;
    event: Types.ObjectId;
    site: Types.ObjectId;
    saleStartTime: Date;
    saleEndTime: Date;
}
export declare const EventTicketSchema: import("mongoose").Schema<EventTicket, import("mongoose").Model<EventTicket, any, any, any, import("mongoose").Document<unknown, any, EventTicket> & EventTicket & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EventTicket, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<EventTicket>> & import("mongoose").FlatRecord<EventTicket> & {
    _id: Types.ObjectId;
}>;
