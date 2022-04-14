import { model, Schema } from "mongoose";
import { GuildInfo } from "passport-discord";

export interface BasicInformation {
    token: string;
    username: string;
    discrim: string;
    avatar_url: string;
}
export interface User {
    userId: string;
    token: string;
    basicInformation: BasicInformation;
    guilds: Array<GuildInfo>
}

export default model("Users/Main", new Schema<User>({
    userId: { type: String },
    token: { type: String },
    basicInformation: { type: Object },
    guilds: [{ type: Object }]
}));
