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
            embeds: [new Embed({
                description: `It appears that **${role.name}** (\`${role.id}\`) is already an auto role!`
        })]})
    }

    await Leveling.findOneAndUpdate({ guildId: ctx.guild.id }, {
        $push: {
            roles: { roleId: role.id, level: level }
        }
    })
    ctx.reply({ embeds: [new Embed({ description: `**${role.name}** has been added to the auto role list! Level: ${level}`})]})
};

export const RemoveAutoRole = async (
  ctx: ExtendedInteraction,
  args: CommandInteractionOptionResolver
) => {
  const role = args.getRole("role");
    const previousData = await Leveling.findOne({ guildId: ctx.guild.id });
    if (role.managed) {
        return ctx.reply({
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
      embeds: [
        new Embed({
          description: `It appears that **${role.name}** (\`${role.id}\`) is not an auto role!`,
        }),
      ],
    });
  }
    previousData.roles.splice(index, 1); previousData.save();
  ctx.reply({
    embeds: [
      new Embed({
        description: `**${role.name}** has been removed to the auto role list!`,
      }),
    ],
  });
};
