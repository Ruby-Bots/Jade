import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";

export default new Command({
    name: `membercount`,
    description: `🏡 | View the current guilds member count!`,
    category: "General",
    execute: async ({ ctx, client }) => {
        ctx.reply({
          ephemeral: true,
          embeds: [
            new Embed({
              author: {
                name: `Member Count`,
                icon_url: client.user.displayAvatarURL({ format: "png" }),
              },
              description: `There are **${
                ctx.guild.memberCount
              }** members in this server. *( ${
                ctx.guild.members.cache.filter((f) => f.user.bot).size
              } bots! )*`,
            }),
          ],
        });
    }
})