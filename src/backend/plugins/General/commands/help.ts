import { EmbedField } from "discord.js";
import { cooldownFormat, permFormat } from "../../../modules/formatters";
import Pagination from "../../../modules/pagination";
import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";

export default new Command({
  name: `help`,
  description: `🏡 | View Jade's basic help panel!`,
  category: "General",
  options: [
    {
      name: "command",
      description: "🏡 | A command!",
      required: false,
      type: "STRING",
    },
  ],
  execute: async ({ ctx, client, args }) => {
    const commandQuery = args.getString("command");
    if (!commandQuery) {
      const categories = [];
      const dropdownCategories = [];
      const commandArray = [];
      client.commands.forEach((command) => {
        commandArray.push(command);
        if (categories.includes(command.category.toLowerCase())) return;
        categories.push(command.category.toLowerCase());
      });
      const pages = [];
      categories.forEach((cata) => {
        dropdownCategories.push({
          label: `${permFormat(cata)}`,
          value: cata.toLowerCase(),
        });
        const commandAr = [];
        client.commands
          .filter((f) => f.category.toLowerCase() === cata.toLowerCase())
          .forEach((command) => {
            if (command.options) {
              if (
                command.options.filter((f) => f.type === "SUB_COMMAND").length >
                0
              ) {
                command.options.forEach((op) => {
                  if (op.type === "SUB_COMMAND") {
                    commandAr.push({ mainCmd: command.name, ...op });
                  }
                });
              } else {
                commandAr.push(command);
              }
            } else {
              commandAr.push(command);
            }
          });
        const pageNums = 8;
        const commandPages = [];
        for (let i = 0; i < commandArray.length; i++) {
          commandPages.push(
            new Embed({
              description: `${commandAr
                .splice(0, pageNums)
                .map(
                  (command) =>
                    `[\`/${
                      command.mainCmd
                        ? `${command.mainCmd} ${command.name}`
                        : command.name
                    }\`](${process.env.URL})\n${client.config.emojis.reply} ${
                      command.description
                        ? command.description.slice(
                            4,
                            command.description.length
                          )
                        : "No Description"
                    }`
                )
                .join("\n")}`,
            })
          );
        }

        pages.push({
          id: cata,
          embed: commandPages.filter((f) => f.description !== ""),
        });
      });
      Pagination(
        pages,
        ctx,
        client,
        dropdownCategories,
        `✨ | Choose a category!`
      );
    } else {
      const command = client.commands.find(
        (c) => c.name.toLowerCase() === commandQuery.toLowerCase()
      );
      if (!command) {
        return ctx.reply({
          embeds: [
            new Embed({
              description: `> **Could not find command** \`${commandQuery}\``,
            }),
          ],
        });
      }
      const cooldown = cooldownFormat(command.cooldown / 1000);
      ctx.reply({
        embeds: [
          new Embed({
            title: `/${command.name} info`,
            description: `**Description**:\n${
              command.description
                ? command.description.slice(4, command.description.length)
                : "No Description"
            }\n\n**Usage**:\n${
              command.usage || "No usage"
            }\n\n**Permissions**:\n${
              command.userPermissions
                ? command.userPermissions
                    .map((perm) => `${permFormat(perm as string)}`)
                    .join(", ")
                : "No permissions required!"
            }`,
            footer: {
              text: `${
                cooldown
                  ? `Cooldown: ${Math.round(cooldown.time)} ${cooldown.type} | `
                  : ""
              }Syntax: <required> [optional]`,
            },
          }),
        ],
      });
    }
  },
});
