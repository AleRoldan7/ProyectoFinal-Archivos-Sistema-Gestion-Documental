import { UserService } from "../service/user-service.service.js";
import type { AuthUser } from "../../common/interfaces/auth-user.interface.js";
import { CreateUserDTO } from "../dto/create-user.dto.js";
import { UpdateUserDTO } from "../dto/update-user.dto.js";
import { StateUserDTO } from "../dto/state-user.dto.js";
export declare class UserController {
    private readonly users;
    constructor(users: UserService);
    me(user: AuthUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    directory(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, "find", {}>;
    create(createDto: CreateUserDTO): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, "find", {}>;
    update(id: string, updateDto: UpdateUserDTO): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    setActivo(id: string, stateDto: StateUserDTO, actor: AuthUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/user.schema.js").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema.js").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
