import { PermissionResolvable } from "discord.js";

export const stringFormat = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
export const permFormat = (str: string) => {
  const words = str.split("_");
  let ar = [];
  words.forEach((w) => {
    ar.push(stringFormat(w));
  });
  return ar.join(" ");
};
export const numberFormat = (num: number) => {
  return Intl.NumberFormat().format(num);
};
export const cooldownFormat = (num: number) => {
  let timeLeft: {
    type:
      | "month(s)"
      | "week(s)"
      | "day(s)"
      | "hour(s)"
      | "minute(s)"
      | "second(s)";
    time: number;
  };
  if (num > 2629800) {
    timeLeft = { type: "month(s)", time: num / 2629800 };
  }
  if (num > 604800) {
    timeLeft = { type: "week(s)", time: num / 604800 };
  }
  if (num > 86400) {
    timeLeft = { type: "day(s)", time: num / 86400 };
  }
  if (num > 3600) {
    timeLeft = { type: "hour(s)", time: num / 3600 };
  }
  if (num > 60) {
    timeLeft = { type: "minute(s)", time: num / 60 };
  }
  if (num < 60) {
    timeLeft = { type: "second(s)", time: num };
    }
    
    return timeLeft
};
