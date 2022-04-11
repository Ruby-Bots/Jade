import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  WebhookClient,
} from "discord.js";
import { CommandTypes, ExtendedInteraction, RegisterCommandsOptions } from "../../typings/classTypes";
import { Config } from "./Config";
import Logger from "../../utils/Logger";
import glob from "glob";
import { promisify } from "util";
import connect from "../../schemas/connect";
import { Event } from "./Event";
import chalk from "chalk";
import { Embed } from "./Embed";
import genNewKey from "../modules/newKey";
const globPromise = promisify(glob);

export const importFile = async (filePath: string) => {
  return (await import(filePath))?.default;
};

export default class Jade extends Client {
  commands: Collection<string, CommandTypes> = new Collection();
  commandArray: Array<CommandTypes> = []
  config: Config = {
    color: "#97a97c",
    emojis: {
      reply: "<:reply:963030853691244544>",
      right_skip: "<:skip_forward:963030853980651561>",
      left_skip: "<:skip_back:963030853666107442>",
      right_arrow: "<:backwards:963030853489926215>",
      left_arrow: "<:forward:963030853716422716>",
      tick: "✅",
      cross: "❌",
    },
  };
  APIKey: string = "filler";
  logger = Logger;
  sendCommandError = async (interaction: ExtendedInteraction, errorMessage: string) => {
    const id = await genNewKey(8);
    interaction.reply({
          ephemeral: true,
            embeds: [
                new Embed({
                    title: `\`${this.config.emojis.cross}\` Unexpected Error!`,
                    description: `>>> Please report error \`${id}\` to Jade's developer!\nYou can do that by running the following command: \`/report ${id}\``
            })
          ]
        })
        const commandErrorWebhook = new WebhookClient({
          id: process.env.COMMAND_ERROR_WEBHOOK_ID,
          token: process.env.COMMAND_ERROR_WEBHOOK_TOKEN,
        });
    if (!commandErrorWebhook) return this.logger.error("No command error webhook found!");
    commandErrorWebhook.send({
      embeds: [
        new Embed({
          title: `New Command Error!`,
          description: `>>> \`\`\`${errorMessage}\`\`\``,
          footer: {
            text: `Error Id: ${id} | Guild: ${interaction.guild.name} (${interaction.guild.id})`,
          },
        }),
      ],
    });
        
    }
  constructor() {
    super({ intents: 32767, allowedMentions: { repliedUser: false } });
  }
  start() {
    this.registerModules();
    this.login(process.env.BETA_DISCORD_TOKEN);
  }

  async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
    if (guildId) {
      //this.guilds.cache.get(guildId)?.commands.set([]);
      this.guilds.cache.get(guildId)?.commands.set(commands);
      this.logger.info(`Registering commands to ${chalk.redBright(guildId)}`);
    } else {
      this.application?.commands.set(commands);
      this.logger.info(`Registering commands ${chalk.redBright(`globally`)}`);
    }
  }

  async registerModules() {
    connect();
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await globPromise(
      `${__dirname}/../plugins/**/commands/*{.ts,.js}`
    );
    commandFiles.forEach(async (filePath) => {
      const command: CommandTypes = await importFile(filePath);
      if (!command.name) return;
      this.commands.set(command.name, command);
      slashCommands.push(command);
      this.commandArray.push(command)
    });
    
    this.on("ready", () => {
      this.registerCommands({
        commands: slashCommands,
        guildId: process.env.GUILD_ID,
      });
    });
    const eventFiles: string[] = [];
    await (
      await globPromise(`${__dirname}/../events/**/*{.ts,.js}`)
    ).forEach((file) => {
      if (file.toLowerCase().includes("process")) return;
      eventFiles.push(file);
    });
    await (
      await globPromise(`${__dirname}/../plugins/**/events/*{.ts,.js}`)
    ).forEach((file) => {
      eventFiles.push(file);
    });
    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await importFile(filePath);
      this.on(event.event, event.run);
    });
  }
}
