import { model, Schema } from "mongoose";

export interface Guild {
  guildId: string;
  channelId: string;
  selfStar: boolean;
  minimumStarCount: number;
}

export default model(
  "Guilds/Starboards",
  new Schema<Guild>({
    guildId: { type: String },
    channelId: { type: String },
    selfStar: { type: Boolean, default: false },
    minimumStarCount: { type: Number, default: 1 },
  })
);
