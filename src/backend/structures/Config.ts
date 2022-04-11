import { ColorResolvable } from "discord.js";

export interface Emojis {
  reply: string;
  right_skip: string;
  left_skip: string;
  right_arrow: string;
  left_arrow: string;
  tick: string;
  cross: string;
}
export interface Links {
  github: string;
  discord: string;
  other: string[];
}

export interface Config {
  color?: ColorResolvable;
  prefix?: string;
  developers?: string[];
  testServers?: string[];
  emojis: Emojis;
  links?: Links;
}
