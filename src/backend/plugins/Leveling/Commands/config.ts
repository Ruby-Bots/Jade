import Leveling from "../../../../schemas/Collections/Guilds/Leveling";
import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";
import { AddAutoRole, RemoveAutoRole } from "../Functions";

export default new Command({
  name: `leveling`,
  description: `📊 | Manage/Edit the servers leveling auto roles.!`,
  userPermissions: ["ADMINISTRATOR"],
  category: "Leveling",
  options: [
    {
      type: "SUB_COMMAND",
      name: "add",
      description: `📊 | Add an auto role`,
      options: [
        {
          type: "ROLE",
          name: "role",
          description: "📊 | The role",
          required: true,
        },
        {
          type: "NUMBER",
          name: "level",
          description: "📊 | The level you wish to give the role at",
          required: true,
          maxValue: 100,
          minValue: 1,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "remove",
      description: `📊 | Remove an auto role`,
      options: [
        {
          type: "ROLE",
          name: "role",
          description: "📊 | The role",
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "list",
      description: `📊 | List all auto roles`,
    },
    {
      type: "SUB_COMMAND",
      name: "toggle",
      description: `📊 | Toggle on/off the leveling system`,
      options: [{ type: "BOOLEAN", name: "value", description: `📊 |  the value`, required: true}]
    },
  ],
  execute: async ({ ctx, args, client }) => {
    const subCommand = args.getSubcommand();
    let previousData = await Leveling.findOne({ guildId: ctx.guild.id });
    if (!previousData) await Leveling.create({ guildId: ctx.guild.id });
    previousData = await Leveling.findOne({ guildId: ctx.guild.id });
    switch (subCommand) {
      case "toggle":
        const value = args.getBoolean("value");
        if (previousData.toggle === value) {
          return ctx.reply({ embeds: [new Embed({ description: `Leveling has already been set to \`${value}\``})]})
        }
        await Leveling.findOneAndUpdate({ guildId: ctx.guild.id }, {
          toggle: value
        })
        return ctx.reply({ embeds: [new Embed({ description: `Leveling has now been **${ value === true ? "enabled" : "disabled"}**!`})]})
        break;
      case "add":
        AddAutoRole(ctx, args);
        break;
      case "remove":
        RemoveAutoRole(ctx, args);
        break;
      case "list":
        ctx.reply({
          embeds: [
            new Embed({
              author: {
                name: `Leveling Auto Role`,
                icon_url: client.user.displayAvatarURL({ format: "png" }),
              },
              description: `${
                previousData.roles.length < 1
                  ? "No auto roles avaliable"
                  : `>>> ` +
                    previousData.roles.map(
                      (r) => `<@&${r.roleId}> (${r.level})`
                    )
              }`,
              footer: { text: `Syntax: <role> (<level>)` },
            }),
          ],
        });
        break;
    }
  },
});
