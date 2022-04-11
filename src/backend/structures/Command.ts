import { CommandTypes } from "../../typings/classTypes";
export class Command {
  constructor(options: CommandTypes) {
    Object.assign(this, options);
  }
}
