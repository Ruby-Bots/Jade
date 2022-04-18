// Coming soon!

import Suggestions from "../../../../schemas/Collections/Guilds/Suggestions";
import { Command } from "../../../structures/Command";
import { AcceptSuggestion, AwaitSuggestion, DenySuggestion, UpdateChannel, UpdateMessages } from "../functions";

export default new Command({
  name: `suggestion`,
  description: `🦕 | Manage/Edit Suggestions`,
  category: "Suggestions",
  userPermissions: ["ADMINISTRATOR"],
  options: [
    {
      type: "SUB_COMMAND",
      name: "accept",
      description: `🦕 | Accept an suggestion!`,
      options: [
        {
          type: "STRING",
          name: "messageid",
          description: `🦕 | The suggestions message id!`,
          required: true,
        },
        {
          type: "STRING",
          name: "reason",
          description: `🦕 | The acception reason!`,
          required: false,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "deny",
      description: `🦕 | Deny an suggestion!`,
      options: [
        {
          type: "STRING",
          name: "messageid",
          description: `🦕 | The suggestions message id!`,
          required: true,
        },
        {
          type: "STRING",
          name: "reason",
          description: `🦕 | The denial reason!`,
          required: false,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "await",
      description: `🦕 | Await an suggestion!`,
      options: [
        {
          type: "STRING",
          name: "messageid",
          description: `🦕 | The suggestions message id!`,
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "channel",
      description: `🦕 | Set the suggestions channel id!`,
    },
    {
      type: "SUB_COMMAND",
      name: "messages",
      description: `🦕 | Set the suggestions repsonse messages!`,
    },
  ],
  execute: async ({ ctx, args }) => {
    const subCommand = args.getSubcommand();
    const suggestionData = await Suggestions.findOne({ guildId: ctx.guild.id })
    if(!suggestionData) await Suggestions.create({ guildId: ctx.guild.id });
    switch (subCommand) {
      case "accept":
        AcceptSuggestion(ctx, args)
        break;
      case "deny":
        DenySuggestion(ctx, args)
        break;
      case "await":
        AwaitSuggestion(ctx, args)
        break;
      case "channel":
        UpdateChannel(ctx, args)
        break;
      case "messages":
        UpdateMessages(ctx, args)
        break;
    }
  },
});