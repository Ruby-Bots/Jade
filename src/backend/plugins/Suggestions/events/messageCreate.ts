import { ColorResolvable, TextChannel } from "discord.js";
import { client } from "../../../..";
import Suggestions from "../../../../schemas/Collections/Guilds/Suggestions";
import messageDelete from "../../../modules/messageDelete";
import { Embed } from "../../../structures/Embed";
import { Event } from "../../../structures/Event";

export default new Event(`messageCreate`, async (message) => {
    const suggestionsData = await Suggestions.findOne({ guildId: message.guild.id })
    if (!suggestionsData || message.author.bot /* || message.member.permissions.has("ADMINISTRATOR") */) return;
    if (message.channel.id === suggestionsData.channelId) {
        messageDelete(message, 200);
        const { content, author } = message;
        const channel = message.guild.channels.cache.find(c => c.id === suggestionsData.channelId) as TextChannel
      const msg = await channel.send({
        embeds: [
          new Embed({
            color: client.config.colors.gold as ColorResolvable,
            author: {
              name: `${author.tag} Suggestion`,
              icon_url: author.displayAvatarURL({ dynamic: true }),
            },
            description: `${content}`,
            footer: {
              text: `ID: ${message.id}`,
              icon_url: client.user.displayAvatarURL({ format: "png" }),
            },
          }),
        ],
      });
      msg.react(client.config.emojis.tick)
      msg.react(client.config.emojis.cross);
    }
})