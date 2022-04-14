import { Message, MessageEmbed, TextChannel } from "discord.js";
import { client } from "../../../..";
import Starboard from "../../../../schemas/Collections/Guilds/Starboard";
import { Event } from "../../../structures/Event";

export default new Event(`messageReactionAdd`, async (reaction, user) => {
  const starboardData = await Starboard.findOne({
    guildId: reaction.message.guild.id,
  }); if (!starboardData || !reaction.message.author || reaction.message.author.bot) return;
    if (reaction.emoji.name === "⭐") {
        if (
          starboardData.selfStar === false &&
          reaction.message.author.id === user.id
        )
          return reaction.users.remove(user.id);
        if (
            starboardData.minimumStarCount >
            reaction.message.reactions.cache
                .filter((f) => f.emoji.name === "⭐")
                .toJSON()[0].count
        ) return;
          const message = reaction.message;
        const starboardChannel = reaction.message.guild.channels.cache.find(f => f.id === starboardData.channelId) as TextChannel
        const previousMessages = starboardChannel.messages.fetch({ limit: 100 });
        const previousEmbedFound:Array<Message> = [];
        (await previousMessages).filter((f) => f.embeds.length > 0).forEach((msg) => { previousEmbedFound.push(msg) })
        let previousEmbed;
        previousEmbedFound.forEach((msg) => {
            if (msg.embeds[0].footer.text.includes(`${reaction.message.id}`)) {
                 previousEmbed = msg
            }
        });
        if (!previousEmbed) {
            const { content, author } = message;
            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({ name: `${author.tag}`, iconURL: author.displayAvatarURL({ dynamic: true }) })
                .setFooter({ text: `ID: ${reaction.message.id}`})
                .setDescription(`${content ? content : ""}\n\n[**Jump To Message**](${message.url})`)
            if (message.attachments) {
                const attachments = [];
                message.attachments.forEach((attachment) => {
                    attachments.push(attachment.url)
                })
                if (attachments.length > 0) {
                    embed.setImage(`${attachments[0]}`);
                }
            }
            starboardChannel.send({ content: `⭐ **${message.reactions.cache.filter((f) => f.emoji.name === "⭐").toJSON()[0].count}** | <#${message.channel.id}>`, embeds: [embed]} )
        } else {          
            previousEmbed.edit({
              content: `⭐ **${message.reactions.cache.filter((f) => f.emoji.name === "⭐").toJSON()[0].count}** | <#${message.channel.id}>`,
                embeds: [previousEmbed.embeds[0]]
            });
        }
  }
});
 