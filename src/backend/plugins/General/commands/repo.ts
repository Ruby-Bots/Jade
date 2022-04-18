import axios from "axios";
import { stringFormat } from "../../../modules/formatters";
import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";

export default new Command({
  name: `repo`,
  description: `🏡 | See basic information about Jade's github repo!`,
  category: "General",
  execute: async ({ ctx, client }) => {
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
          title: `Jade's Github Repo`,
          description: `>>> ${commit
            .map((c) =>
              c
                ? `[**${c.sha}**](${c.html_url}) - ${c.commit.author.date
                    .slice(0, 10)
                    .replace("-", "/")
                    .replace("-", "/")} ([**${c.committer.login}**](${
                    c.committer.html_url
                  }))`
                : "No commit found!"
            )
            .join("\n")}`,
        }),
      ],
    });
  },
});
