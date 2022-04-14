import { model, Schema } from "mongoose";

export interface Guild {
  guildId: string;
  channelId: string;
  dmResponse: boolean;
  accept_message: string;
    deny_message: string;
}

export default model(
  "Guilds/Suggestions",
  new Schema<Guild>({
    guildId: { type: String },
    channelId: { type: String },
    dmResponse: { type: Boolean, default: true },
    accept_message: {
      type: String,
      default: `> **{{user#tag}}** your suggestion \`{{id}}\` has been accepted!\n\n>>> {{reason}}`,
    },
    deny_message: {
      type: String,
      default: `> **{{user#tag}}** your suggestion \`{{id}}\` has been denied!\n\n>>> {{reason}}`,
    },
  })
);
