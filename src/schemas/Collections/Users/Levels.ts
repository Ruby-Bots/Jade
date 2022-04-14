import { model, Schema } from "mongoose";

export interface User {
  userId: string;
  guildId: string;
  level: number;
  xp: number;
  requiredXp: number;
}

export default model(
  "Users/Level",
  new Schema<User>({
    userId: { type: String },
    guildId: { type: String },
    level: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    requiredXp: { type: Number, default: 2345 },
  })
);
