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

export interface Colors {
  gold: string; //#ffb94b
  purple: string; //#a98aff
  blue: string; // #6fbaff
  red: string; // #fe7d7d
  pink: string; // #ff76d9
  blue2: string; // #337fd5
  green: string; // #52b788
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
  colors?: Colors
}
