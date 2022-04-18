import axios from "axios";
import { InteractionReplyOptions } from "discord.js";
import Pagination from "../../../modules/pagination";
import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";

export default new Command({
  name: `github`,
  description: `💾 | View informaiton on a github repo or user!`,
  category: "API",
  options: [
    {
      type: "SUB_COMMAND",
      name: "user",
      description: `💾 | View information on a github user!`,
      options: [
        {
          name: `query`,
          type: "STRING",
          description: `💾 | A Github user, username!`,
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "repo",
      description: `💾 | View information on a github repo!`,
      options: [
        {
          name: `query`,
          type: "STRING",
          description: `💾 | A Github topic / repo name!`,
          required: true,
        },
      ],
    },
  ],
  execute: async ({ ctx, client, args }) => {
    const subcommand = args.getSubcommand();
    const query = args.getString("query") || "sdafgasgsdgsfsdfsf";
    let res: InteractionReplyOptions;
    if (subcommand === "user") {
      try {
        const data = (
        await axios.get(`https://api.github.com/users/${query.toLowerCase()}`)
      ).data;
      if (
        !data || data.message
          ? data.message.toLowerCase() === "not found"
          : false
      ) {
        return ctx.reply({
          ephemeral: true,
          embeds: [
            new Embed({
              description: `Could not find a user under the name of **${query}**`,
            }),
          ],
        });
      }
      const pins = await (
        await axios.get(
          `https://api.github.com/users/${data.login}/repos?sort=pin`
        )
      ).data;
      const createdDate = new Date(data.created_at).getTime();
      const lastUpdated = new Date(data.updated_at).getTime();
        res = {
          ephemeral: true,
          embeds: [
            new Embed({
              title: `"${data.login}" information`,
              description: `>>> ${data.bio || "No user bio!"}`,
              url: data.html_url,
              thumbnail: { proxy_url: data.avatar_url },
              fields: [
                {
                  name: `Account Type`,
                  value: `${data.type}`,
                  inline: true,
                },
                {
                  name: `Created`,
                  value: `<t:${Math.floor(createdDate / 1000)}:d>`,
                  inline: true,
                },
                {
                  name: `Last Update`,
                  value: `<t:${Math.floor(lastUpdated / 1000)}:R>`,
                  inline: true,
                },
                {
                  name: `Pinned Repos`,
                  value: `${
                    pins
                      ? pins
                          .slice(0, 5)
                          .map(
                            (pin) =>
                              `\`⭐\` ${pin.stargazers_count} | **${pin.name}** - [\`${pin.full_name}\`](${pin.html_url})`
                          )
                          .join("\n")
                      : "No pinned repositorys"
                  }`,
                },
              ],
            }),
          ],
        };
      } catch (err) {
        return ctx.reply({
          ephemeral: true,
          embeds: [
            new Embed({
              description: `An error occured fetching information for **${query}**`,
            }),
          ],
        });
      }
    }
    if (subcommand === "repo") {
      const data = await (
        await axios.get(
          `https://api.github.com/search/repositories?q=${query}&per_page=10`
        )
      ).data;
      if (
        !data || data.items.length < 1
      ) {
        return ctx.reply({
          embeds: [
            new Embed({
              description: `>>> Could not find any repos under the name of \`${query}\``,
            }),
          ],
        });
      }
      const pages = [];
        const dropdownCategories = [];
      data.items.forEach((item) => {
        dropdownCategories.push({
          label: `${item.full_name} - ${item.owner.login}`,
          value: `${item.id}`,
        });
        pages.push({
          id: `${item.id}`,
          embed: [
            new Embed({
              title: `${item.full_name}`,
              url: item.html_url,
              description: `>>> ${item.description || "No description"}`,
              fields: [
                {
                  name: `Created`,
                  value: `<t:${Math.floor(
                    new Date(item.created_at).getTime() / 1000
                  )}:f>`,
                  inline: true,
                },
                {
                  name: `Last Repo Change`,
                  value: `<t:${Math.floor(
                    new Date(item.updated_at).getTime() / 1000
                  )}:R>`,
                  inline: true,
                },
                {
                  name: `Last Push`,
                  value: `<t:${Math.floor(
                    new Date(item.pushed_at).getTime() / 1000
                  )}:R>`,
                  inline: true,
                },
                {
                  name: `Language`,
                  value: `${item.language || "No language found"}`,
                },
                {
                  name: `Basic Information`,
                  value: `**Stars**: ${
                    item.stargazers_count || 0
                  }\n**Forks**: ${item.forks || 0}\n**Open Issues**: ${
                    item.open_issues
                  }${
                    item.license
                      ? `\n**License**: [**${item.license.name}**](${item.license.url})`
                      : ""
                  }`,
                },
              ],
            }),
          ],
        });
      });
      Pagination(
        pages,
        ctx,
        client,
        dropdownCategories,
        "✨ | Choose a repo below!"
      );
    }

    if (res) {
      ctx.reply(res);
    }
  },
});
