import Links from "../../../modules/Buttons/Links";
import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";

export default new Command({
    name: `invite`,
    description: `🏡 | Invite Jade!`,
    category: "General",
    execute: async ({ ctx, client }) => {
        ctx.reply({
        components: [Links],
          embeds: [
            new Embed({
              author: {
                name: `Thanks for taking this opportunity!`,
                icon_url: client.user.displayAvatarURL({ format: "png" }),
              },
              description: `You can invite jade below! Thank you for considering this!\nEach invite is much appreciated by the jade team!`,
            }),
          ],
        });
    }
})