import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";
import { client } from "../../..";
import cooldowns from "../../modules/cooldowns";
import { ExtendedInteraction } from "../../../typings/classTypes";
import Jade from "../../structures/Client";
import { Event } from "../../structures/Event";
import { Embed } from "../../structures/Embed";

export default new Event(`interactionCreate`, async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({ content: `Command not found.` });
    }
    interaction.member = interaction.guild.members.cache.find(
      (m) => m.user.id === interaction.user.id
    );
    if (!command.cooldown) {
      command["cooldown"] = 1000;
    }
    if (
      !interaction.guild.members.cache
        .find((m) => m.id === client.user.id)
        .permissions.has(["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"])
    )
      return;
    try {
      await cooldowns(command, interaction.user.id, interaction, {
        args: interaction.options as CommandInteractionOptionResolver,
        client: client,
        ctx: interaction as ExtendedInteraction,
      });
    } catch (err) {
      client.logger.error(err.message);
      return client.sendCommandError(interaction as ExtendedInteraction, err.message)
    }
  }
});
