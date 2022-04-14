import { model, Schema } from "mongoose";

export interface Role {
    roleId: string;
    level: number;
}
export interface Leveling {
    guildId: string;
    toggle: boolean;
    message: string;
    roles: Array<Role>
}

export default model("Guilds/Levelings", new Schema<Leveling>({
    guildId: { type: String },
    toggle: { type: Boolean, default: true },
    message: { type: String, default: `**[LEVEL UP]** Congrats on leveling up {{user#mention}}! You are now level **{{level}}**`},
    roles: [{ type: Object }]
}));
