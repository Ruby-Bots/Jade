import {
  ButtonInteraction,
  CommandInteractionOptionResolver,
  MessageActionRow,
  MessageSelectMenu,
  TextChannel,
} from "discord.js";
import Starboard from "../../../schemas/Collections/Guilds/Starboard";
import { ExtendedInteraction } from "../../../typings/classTypes";
import Jade from "../../structures/Client";
import { Embed } from "../../structures/Embed";

export const Guide = async (
  ctx: ExtendedInteraction,
  client: Jade,
  args: CommandInteractionOptionResolver
) => {
  ctx.reply({
    embeds: [
      new Embed({
        title: `Starboard Guide!`,
        description: `> Here is were you can view all of the starboard commands!\n> ( These can also be viewed on the help menu! \`/help\`) \n\n**Commands:**\n>>> \`/starboard guide:\` This embed!\n\`/starboard channel:\` Channel the starboard channel!\n\`/starboard selfstar:\` Toggle if the starboard will trigger on self star\n\`/starboard minimum:\` Change the minimum amount of required stars!\n\`/starboard config:\` View the current saved data for this guild/server!`,
      }),
    ],
  });
};

export const UpdateChannel = async (
  ctx: ExtendedInteraction | ButtonInteraction,
  client: Jade,
  args: CommandInteractionOptionResolver
) => {
  let dropdowns = [];
  const channels = [];
  ctx.guild.channels.cache
    .filter(
      (f) =>
        f.type === "GUILD_TEXT" &&
        f
          .permissionsFor(ctx.guild.me)
          .has(["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES"])
    )
    .sort((a: TextChannel, b: TextChannel) => a.position - b.position)
    .forEach((channel) => {
      channels.push({
        label: `${channel.name} - ${channel.parent.name || "No category"}`,
        value: `${channel.id}`,
      });
    });
  for (let i = 0; i < channels.length; i++) {
    dropdowns.push(
      new MessageActionRow().addComponents([
        new MessageSelectMenu()
          .addOptions(channels.splice(0, 24))
          .setCustomId(`starboard_channel_dropdown_id_${i}`),
      ])
    );
  }
  ctx.reply({
    ephemeral: true,
    components: dropdowns,
    embeds: [
      new Embed({
        title: `Starboard Channel!`,
        description: `>>> Please select one of the channels below, once selected it will be set as the channel were the actual starboard messages go!`,
      }),
    ],
  });
  let channelId;
  const collector = ctx.channel.createMessageComponentCollector({
    componentType: "SELECT_MENU",
  });
  collector.on("collect", (i) => {
    if (i.user.id !== ctx.user.id || i.user.bot)
      return i.reply({
        embeds: [
          new Embed({
            description: `>>> This prompt can only be ran by **${ctx.user.tag}**`,
          }),
        ],
      });
    channelId = `${i.values[0]}`;
    return collector.stop("end");
  });
  collector.on("end", async (c, r) => {
    if (r.toLowerCase() === "end") {
      await Starboard.findOneAndUpdate(
        { guildId: ctx.guild.id },
        {
          channelId: channelId,
        }
      );
      const channel = ctx.guild.channels.cache.find((f) => f.id === channelId);
      ctx.editReply({
        components: [],
        embeds: [
          new Embed({
            description: `>>> Starboard channel has been updated to **${channel.name}** *(${channel.id})*`,
          }),
        ],
      });
    }
  });
};
