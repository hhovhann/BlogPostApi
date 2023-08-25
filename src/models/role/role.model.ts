import {Schema, model} from "mongoose";
import {IRole} from "../../interfaces/role/role.interface";

export const RoleSchema = new Schema(
    {name: {type: String, required: [true, "Field is required"]},},
    {versionKey: false}
);

const Role = model<IRole>("Role", RoleSchema);

export default Role;
