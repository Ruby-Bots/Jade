import { PermissionResolvable } from "discord.js";
import { permFormat } from "../../../modules/formatters";
import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";

const defaultPermissions: PermissionResolvable[] = [
  "VIEW_CHANNEL",
  "SEND_MESSAGES",
  "EMBED_LINKS",
  "BAN_MEMBERS",
  "KICK_MEMBERS",
  "VIEW_AUDIT_LOG",
  "USE_EXTERNAL_EMOJIS",
  "MANAGE_CHANNELS",
  "MANAGE_MESSAGES",
  "MANAGE_EMOJIS_AND_STICKERS",
  "ADMINISTRATOR",
  "MANAGE_NICKNAMES",
  "MANAGE_ROLES",
  "MANAGE_WEBHOOKS",
  "CREATE_INSTANT_INVITE",
  "MANAGE_GUILD",
  "SEND_MESSAGES_IN_THREADS",
];
export default new Command({
  name: `checkperms`,
  category: `General`,
  description: `🏡 | Test Jade's permissions for the current server.`,
  execute: async ({ ctx, client }) => {
    const permissions = [];
    ctx.guild.me.roles.highest.permissions.toArray().forEach((perm) => {
      if (!defaultPermissions.includes(perm)) return;
      if (ctx.guild.me.permissions.toArray().includes("ADMINISTRATOR")) {
        return permissions.push(
          `\`${client.config.emojis.tick}\` **${permFormat(perm)}** *(Success)*`
        );
      }
      if (ctx.guild.me.permissions.toArray().includes(perm)) {
        permissions.push(
          `\`${client.config.emojis.tick}\` **${permFormat(perm)}** *(Success)*`
        );
      } else {
        permissions.push(
          `\`${client.config.emojis.cross}\` **${permFormat(perm)}** *(Failed)*`
        );
      }
    });
    ctx.reply({
      ephemeral: true,
      embeds: [
        new Embed({
          author: {
            name: `Jade's Permissions`,
            icon_url: client.user.displayAvatarURL({ format: "png" }),
          },
          description: `These permissions are required for some features to work, if Jade is missing any then they may not work as intended.\n\n>>> ${permissions.join(
            "\n"
          )}`,
        }),
      ],
    });
  },
});
