import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";

export default new Command({
    name: `reload`,
    description: `🔑 | Reload all commands!`,
    category: "Owner",
    owner: true,
    cooldown: 60 * 1000 * 60,
    execute: async ({ ctx, client }) => {
        ctx.guild?.commands.set(client.commandArray);
        ctx.reply({ ephemeral: true, embeds: [new Embed({ description: `Commands have been reloaded in **${ctx.guild.name}**`})]})
    }
})