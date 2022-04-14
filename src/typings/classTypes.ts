import {
  ApplicationCommandDataResolvable,
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  Message,
  PermissionResolvable,
} from "discord.js";
import { Request, Response } from "express";
import Jade from "../backend/structures/Client";

//? Client

export interface RegisterCommandsOptions {
  guildId?: string;
  commands: ApplicationCommandDataResolvable[];
}


//? Commands - Slash

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}

export interface CommandRunInterface {
  client: Jade;
  ctx: ExtendedInteraction;
  args: CommandInteractionOptionResolver;
}

export type CommandRun = (options: CommandRunInterface) => any;

export type CommandTypes = {
  userPermissions?: PermissionResolvable[];
  botPermissions?: PermissionResolvable[];
  cooldown?: number;
  usage?: string;
  category: string;
  owner?: boolean;
  execute: CommandRun;
} & ChatInputApplicationCommandData;

//? Routes

export interface RunInterface {
  client: Jade;
}

export type RouteRun = (
  req: Request,
  res: Response,
  options: RunInterface
) => any;

export type RouteTypes = {
  name: string;
  middleware?: any[];
  execute: RouteRun;
};
