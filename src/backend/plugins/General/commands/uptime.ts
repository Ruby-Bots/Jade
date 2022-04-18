import humanizeDuration from "humanize-duration";
import moment from "moment";
import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";
require("moment-duration-format");

export default new Command({
  name: `uptime`,
  description: `🏡 | See Jade's uptime.`,
  category: "General",
  execute: async ({ ctx, client }) => {
    const timestamp = new Date().getTime() - Math.floor(client.uptime);
    ctx.reply({
      ephemeral: true,
      embeds: [
        new Embed({
          author: {
            name: `Jade's Uptime`,
            icon_url: client.user.displayAvatarURL({ format: "png" }),
          },
          description: `>>> **Length**: ${humanizeDuration(
            Math.round(client.uptime)
          )}\n **Date Launched**: <t:${moment(timestamp).unix()}> (<t:${moment(
            timestamp
          ).unix()}:R>)`,
        }),
      ],
    });
  },
});
