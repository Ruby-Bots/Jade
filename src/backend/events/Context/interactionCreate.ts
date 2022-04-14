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
import e from "express";

export default new Event(`interactionCreate`, async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({ content: `Command not found.` });
    }
    interaction.member = interaction.guild.members.cache.find(
      (m) => m.user.id === interaction.user.id
    );
    if (
      !interaction.guild.members.cache
        .find((m) => m.id === client.user.id)
        .permissions.has(["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"])
    )
      return;
    
    if (command.owner && !client.config.developers.includes(interaction.user.id)) {
        return interaction.reply({ embeds: [new Embed({ description: `>>> You can not run this command! *( Owner Only)`})]})
    }
    if (!interaction.member.permissions.has(command.userPermissions || [])) {
      return interaction.reply({ embeds: [new Embed({ description: `>>> It appears you are missing the required permissions to use **${command.name}**!`})]})
    }
    try {
      if (command.cooldown) {
        await cooldowns(command, interaction.user.id, interaction, {
          args: interaction.options as CommandInteractionOptionResolver,
          client: client,
          ctx: interaction as ExtendedInteraction,
        });
      } else {
        command.execute({
          args: interaction.options as CommandInteractionOptionResolver,
          client: client,
          ctx: interaction as ExtendedInteraction,
        });
      }
    } catch (err) {
      client.logger.error(err.message);
      return client.sendCommandError(
        interaction as ExtendedInteraction,
        true,
        `>>> \`\`\`${err.message}\`\`\``
      );
    }
  }
});
