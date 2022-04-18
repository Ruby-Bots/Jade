import Levels from "../../../../schemas/Collections/Users/Levels";
import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";

export default new Command({
  name: `rank`,
  description: `📊 | See ranking information on a certian user`,
    category: "Leveling",
  options: [ { type: "USER", name: "user", description: "📊 | The user", required: false}],
  execute: async ({ ctx, args }) => {
    const user = args.getUser("user") || ctx.user;
    const member = ctx.guild.members.cache.find((m) => m.id === user.id);
    if (!member) {
      return ctx.reply({
        ephemeral: true,
        embeds: [
          new Embed({
            description: `Could not find a user! Please try again later`,
          }),
        ],
      });
    }

    const Level = await Levels.findOne({ userId: member.user.id, guildId: ctx.guild.id })
    if (!Level) {
      return ctx.reply({
        ephemeral: true,
        embeds: [
          new Embed({
            description: `Could not find any leveling data for this member!`,
          }),
        ],
      });
    }

    ctx.reply({
      ephemeral: true,
      embeds: [
        new Embed({
          author: {
            name: `${member.user.tag}'s Level`,
            icon_url: member.user.displayAvatarURL({ dynamic: true }),
          },
          description: `>>> **Level**: ${Level.level}\n **XP**: ${Level.xp}/${Level.requiredXp}`,
        }),
      ],
    });
  },
});
