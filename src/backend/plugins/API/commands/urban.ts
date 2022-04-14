import axios from "axios";
import Pagination from "../../../modules/pagination";
import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";

export default new Command({
  name: `urban`,
  description: `💾 | See the urban dictionary for a word!!`,
  options: [
    {
      type: "STRING",
      name: "query",
      description: `💻 | A word!`,
      required: true,
    },
  ],
  category: "api",
  execute: async ({ ctx, args, client }) => {
    const query = args.getString("query");
    axios
      .get(`http://api.urbandictionary.com/v0/define?term=${query}`)
      .then(async (res) => {
        if (!res) {
          ctx.reply({ ephemeral: true, embeds: [new Embed({ description: `Could not find any search query under the name \`${query}\``})]})
        }
        const pages = [];
        const categories = [];
        res.data.list.forEach((item) => {
          categories.push({
            label: `${item.example.slice(0, 45)} - ${item.author}`,
            value: `${item.defid}`,
          });
          pages.push({
            id: `${item.defid}`,
            embed: [
              new Embed({
                title: `${item.example}`,
                url: `${item.permalink}`,
                description: `${item.definition
                  .slice(0, 1024)
                  .replace("]", "")
                  .replace("[", "")}`,
                fields: [
                  {
                    name: `General`,
                    value: `**Author**: ${item.author}\n**Example**: ${item.example}\n**Rating**: 👍 ${item.thumbs_up} | 👎 ${item.thumbs_down}`,
                  },
                ],
              }),
            ],
          });
        });
        Pagination(pages, ctx, client, categories);
      });
  },
});
