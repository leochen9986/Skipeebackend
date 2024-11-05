import { UserRoles } from 'src/users/schemas/user.schema';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: UserRoles;
    worksIn: string;
    organizerName?: string;
    isActive: boolean;
}
