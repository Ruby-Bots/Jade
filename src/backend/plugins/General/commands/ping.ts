import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";
export default new Command({
    name: `ping`,
    description: `🏡 | Check the bot's response time.`,
    category: "General",
    execute: async ({ ctx, client }) => {
        ctx.reply({ ephemeral: true, content: `Pinging...` }).then((int) => {
          ctx.editReply({
            content: `\`🏓\` Pong!`,
            embeds: [
              new Embed({
                description: `>>> WS: \`${client.ws.ping}\`ms\n My Ping: \`${(
                  Date.now() - ctx.createdTimestamp
                )
                  .toString()
                  .replace(/-/g, "")}\`ms`,
              }),
            ],
          });
        });
    }
})