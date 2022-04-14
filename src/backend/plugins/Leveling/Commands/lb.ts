import { MessageActionRow, MessageButton } from "discord.js";
import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";

export default new Command({
  name: `leaderboard`,
  description: `📊 | See the current servers leaderboard`,
  category: "Leveling",
  execute: async ({ ctx }) => {
    ctx.reply({
      components: [new MessageActionRow().addComponents([new MessageButton().setLabel("Leaderboard").setURL(`${process.env.URL}/leaderboard/${ctx.guild.id}`).setStyle("LINK")])],
      embeds: [new Embed({
        description: `You can view **${ctx.guild.name}**'s leaderboard using the link below!`
      })]})
  },
});
