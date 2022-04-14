import axios from "axios";
import Pagination from "../../../modules/pagination";
import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";

export default new Command({
  name: `anime`,
  description: `💻 | Gain information about a certain anime!`,
  options: [
    {
      type: "STRING",
      name: "query",
      description: `💻 | Anime title!`,
      required: true,
    },
  ],
  category: "api",
 execute: async ({ ctx, args, client }) => {
    const query = args.getString("query");
    axios
      .get(`https://kitsu.io/api/edge/anime?filter[text]=${query}`)
      .then((res) => {
        const data = res.data.data[0].attributes;
        if (!data) {
          return ctx.reply({
            ephemeral: true,
            embeds: [
              new Embed({
                description: `I could not find an anime under the name of \`${query}\``,
              }),
            ],
          });
        }

        const titles = [];
        Object.keys(data.titles).forEach((lang) => {
          if (!lang) return;
          if (lang.startsWith("en") && lang !== "en") return;
          titles.push(data.titles[lang]);
        });
        const pages = [];
        const cataTitles = [];
        res.data.data.forEach((anime) => {
          const data = anime.attributes;
          cataTitles.push({
            label: `${
              (data.titles.en || "No english name found").slice(0, 50)
            } - ${
              data.titles.ja_jp
                ? data.titles.ja_jp.slice(0, 50)
                : "No japanese name found"
            }`,
            value: `${anime.id}`,
          });
          pages.push({
            id: `${anime.id}`,
            embed: [
              new Embed({
                title: `${
                  data.titles.en || data.titles.ja_jp
                    ? data.titles.ja_jp
                    : "No name found"
                }`,
                url: `https://kitsu.io/anime/${anime.id}`,
                description: `>>> ${data.synopsis.slice(0, 1000)}`,
                fields: [
                  {
                    name: `Abbreviated Titles`,
                    value: ` - ${titles.join("\n - ")}`,
                    inline: true,
                  },
                  {
                    name: `Adverage Rating`,
                    value: `${data.averageRating}`,
                    inline: true,
                  },
                  {
                    name: `\u200B`,
                    value: `\u200B`,
                    inline: true,
                  },
                  {
                    name: `Age Rating`,
                    value: `${data.ageRating}`,
                    inline: true,
                  },
                  { name: `NSFW`, value: `${data.nsfw}`, inline: true },
                  {
                    name: `\u200B`,
                    value: `\u200B`,
                    inline: true,
                  },
                ],
                image: { proxy_url: `${data.posterImage.medium}` },
              }),
            ],
          });
        });
  
        Pagination(pages, ctx, client, cataTitles, "✨ | Choose an anime below!")
      });
  },
});
