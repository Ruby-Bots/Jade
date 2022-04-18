import { Command } from "../../../structures/Command";
import * as os from "os";
import * as osUtils from "os-utils";
import { Embed } from "../../../structures/Embed";
import axios from "axios";
import { stringFormat } from "../../../modules/formatters";
export default new Command({
  name: `info`,
  description: `🏡 | View information about Jade!`,
  category: "General",
  execute: async ({ client, ctx }) => {
    const owner = client.users.cache.find((f) => f.id === process.env.OWNER_ID);
    const commit = (
      await axios.get(
        `https://api.github.com/repos/Saigeie/${stringFormat(
          client.user.username
        )}/commits?per_page=5`
      )
    ).data;
    ctx.reply({
      ephemeral: true,
      embeds: [
        new Embed({
          author: {
            name: `Jade's Information`,
            icon_url: client.user.displayAvatarURL({ format: "png" }),
          },
          fields: [
            {
              name: `Developer`,
              value: `[**${owner.tag}**](${process.env.URL}) (\`${process.env.OWNER_ID}\`)`,
            },
            {
              name: `Guild Count`,
              value: `**${client.guilds.cache.size}** users`,
              inline: true,
            },
            {
              name: `User Count`,
              value: `**${client.users.cache.size}** members`,
              inline: true,
            },
            {
              name: `Command Count`,
              value: `**${client.commands.size}** commands`,
              inline: true,
            },
            {
              name: `OS Info`,
              value: `>>> \`\`\`diff\n- CPU: ${
                os.cpus()[0].model
              }\n- Platform: ${os.platform()} (${os.arch()})\n- Memory: ${Math.round(
                process.memoryUsage().heapUsed / 1024 / 1024
              )} MB / ${Math.round(osUtils.totalmem())} ${
                Math.round(osUtils.totalmem()) > 1000 ? "GB" : "MB"
              }\n\n\`\`\``,
            },
            {
              name: `Latest Commits`,
              value: `>>> ${commit
                .map((c) =>
                  c ? `[**${c.sha}**](${c.html_url})` : "No Commit Found"
                )
                .join("\n")}`,
            },
          ],
        }),
      ],
    });
  },
});
