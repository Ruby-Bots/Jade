import { CommandInteractionOptionResolver, GuildMember } from "discord.js";
import Leveling from "../../../schemas/Collections/Guilds/Leveling";
import { User } from "../../../schemas/Collections/Users/Levels"
import { ExtendedInteraction } from "../../../typings/classTypes";
import { Embed } from "../../structures/Embed";


export const AddAutoRole = async (
  ctx: ExtendedInteraction,
  args: CommandInteractionOptionResolver
) => {
    const role = args.getRole("role");
    if (role.managed) {
      return ctx.reply({
        ephemeral: true,
        embeds: [
          new Embed({
            description: `This role is a bot only role! Meaning it can not be used as an auto role.`,
          }),
        ],
      });
    }
    const level = args.getNumber("level");
    const previousData = await Leveling.findOne({ guildId: ctx.guild.id });
    let includesRole = false;
    previousData.roles.forEach((r) => {
        if(r.roleId === role.id) { includesRole = true }
    })
    if (includesRole) { 
      return ctx.reply({
        ephemeral: true,
        embeds: [
          new Embed({
            description: `It appears that **${role.name}** (\`${role.id}\`) is already an auto role!`,
          }),
        ],
      });
    }

    await Leveling.findOneAndUpdate({ guildId: ctx.guild.id }, {
        $push: {
            roles: { roleId: role.id, level: level }
        }
    })
    ctx.reply({
      ephemeral: true,
      embeds: [
        new Embed({
          description: `**${role.name}** has been added to the auto role list! Level: ${level}`,
        }),
      ],
    });
};

export const RemoveAutoRole = async (
  ctx: ExtendedInteraction,
  args: CommandInteractionOptionResolver
) => {
  const role = args.getRole("role");
    const previousData = await Leveling.findOne({ guildId: ctx.guild.id });
    if (role.managed) {
      return ctx.reply({
        ephemeral: true,
        embeds: [
          new Embed({
            description: `This role is a bot only role! Meaning it can not be used as an auto role.`,
          }),
        ],
      });
    }
    let includesRole = false;
    let index;
  previousData.roles.forEach((r) => {
    if (r.roleId === role.id) {
        includesRole = true;
        index = previousData.roles.indexOf(r)
    }
  });
  if (!includesRole) {
    return ctx.reply({
      ephemeral: true,
      embeds: [
        new Embed({
          description: `It appears that **${role.name}** (\`${role.id}\`) is not an auto role!`,
        }),
      ],
    });
  }
    previousData.roles.splice(index, 1); previousData.save();
  ctx.reply({
    ephemeral: true,
    embeds: [
      new Embed({
        description: `**${role.name}** has been removed to the auto role list!`,
      }),
    ],
  });
};

const values = [
    { key: `{{level}}`, value: `The users level` },
    { key: `{{user#tag}}`, value: `The users tag` },
    { key: `{{user#id}}`, value: `The user Id` },
    { key: `{{user#mention}}`, value: `Mention the member` },
    { key: `{{user#username}}`, value: `The username` },
    { key: `{{xp}`, value: `The current xp` },
    { key: `{{requiredxp}`, value: `The new required xp` },
  ];

export const UpdateMessage = async (
  ctx: ExtendedInteraction,
  args: CommandInteractionOptionResolver
) => {
  const FormatOptions = []
  values.forEach((v) => { FormatOptions.push(`**${v.key}**: ${v.value}`)})
  ctx.reply({
    ephemeral: true,
    embeds: [
      new Embed({
        description: `Please type the message below!\n\n>>> ${FormatOptions.join(
          "\n"
        )}`,
      }),
    ],
  });
  const collector = ctx.channel.createMessageCollector({ time: 35000 })
  let response;
  collector.on("collect", (msg) => {
    if (msg.author.id !== ctx.user.id || msg.author.bot) return;
    response = msg.content.slice(0, 1024);
    return collector.stop("finshed")
  })
  collector.on("end", async (c, r) => {
        if (r.toLowerCase() === "finshed") {
          await Leveling.findOneAndUpdate({ guildId: ctx.guild.id }, {
            message: response
          })
          ctx.editReply({
            embeds: [
              new Embed({
                description: `Message has been collected successfully and updated!`,
              }),
            ],
          });
        } else {
          ctx.editReply({
            embeds: [
              new Embed({
                description: `It appears you have ran out of time, You only have **35** seconds!`,
              }),
            ],
          });

        }
      })
}