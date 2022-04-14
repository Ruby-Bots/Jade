import Starboard from "../../../../schemas/Collections/Guilds/Starboard";
import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";
import { Guide, UpdateChannel } from "../functions";
export default new Command({
  name: `starboard`,
  description: `✨ | Manage the server's starboard!`,
  category: "Starboard",
  userPermissions: ["ADMINISTRATOR"],
  options: [
    {
      type: "SUB_COMMAND",
      description: `✨ | Starboard information/guide!`,
      name: "guide",
    },
    {
      type: "SUB_COMMAND",
      description: `✨ | Change/Set the starboard channel!`,
      name: "channel",
    },
    {
      type: "SUB_COMMAND",
      description: `✨ | Toggle if the starboard should go off on a self ( message author ) star!`,
        name: "selfstar",
      options: [ { type: "BOOLEAN", name: "value", description: `✨ | True/False`, required: true}]
    },
    {
      type: "SUB_COMMAND",
      description: `✨ | The minimum amount of required stars! **Cap: 25**`,
        name: "minimum",
      options: [{ type: "NUMBER", name: "cap", description: `✨ | 1 - 25`, minValue: 1, maxValue: 25, required: true}]
    },
    {
      type: "SUB_COMMAND",
      description: `✨ | View the current starboard config!`,
      name: "config",
    },
  ],
  execute: async ({ ctx, client, args }) => {
      const subCommand = args.getSubcommand();
      let starboardData = await Starboard.findOne({ guildId: ctx.guild.id })
      if (!starboardData) await Starboard.create({ guildId: ctx.guild.id })
      starboardData = await Starboard.findOne({ guildId: ctx.guild.id });
      switch (subCommand) {
          case "guide":
              Guide(ctx, client, args)
          break;
          case "channel":
              UpdateChannel(ctx, client, args)
          break;
          case "selfstar":
              const val = args.getBoolean("value")
              if (val === starboardData.selfStar) {
                  return ctx.reply({
                      ephemeral: true,
                      embeds: [new Embed({
                        description: `Self star is already set to \`${val}\``
                    })]})
              }
              await Starboard.findOneAndUpdate({ guildId: ctx.guild.id }, { selfStar: val })
              ctx.reply({ ephemeral: true, embeds: [new Embed({ description: `Self star's value has been set to \`${val}\``})]})
          break;
          case "minimum":
              const num = args.getNumber("cap")
              if (num !== starboardData.minimumStarCount) {
                  await Starboard.findOneAndUpdate(
                    { guildId: ctx.guild.id },
                    { minimumStarCount: num }
                  );
              }
              ctx.reply({
                ephemeral: true,
                embeds: [
                  new Embed({
                    description: `The minium star amount has been set to \`${num}\``,
                  }),
                ],
              });
              break; 
          case "config":
              const channel = ctx.guild.channels.cache.find(c => c.id === starboardData.channelId)
              ctx.reply({
                ephemeral: true,
                embeds: [
                  new Embed({
                    description: `**Star Board Config** | ${
                      ctx.guild.name
                    } *(${ctx.guild.id})*\n\n>>> \`\`\`json\nChannel: "${
                      channel
                        ? `${channel.name} (${channel.id})`
                        : "No channel!"
                    }"\nSelfStar: "${
                      starboardData.selfStar || "false"
                    }"\nMinimum Star Count: "${
                      starboardData.minimumStarCount || 1
                    }"\n\`\`\``,
                  }),
                ],
              });
              break;
      }
  },
});
