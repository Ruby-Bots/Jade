import { CommandRunInterface, CommandTypes } from "../../typings/classTypes"
import Cooldowns from "../../schemas/Collections/Commands/cooldowns"
import { CommandInteraction, Message } from "discord.js"
import { Embed } from "../structures/Embed"
const cooldowns = async (command: CommandTypes, userId: string, message: CommandInteraction, commandParmas: CommandRunInterface) => {
    let cooldown = await Cooldowns.findOne({ userId, command: command.name });
    if (cooldown) {
        const now = Date.now();
        const expiratioDate = command.cooldown + cooldown.now;
        if (now < expiratioDate) {
            const timeLeftWhole = (expiratioDate - now) / 1000;
            let timeLeft: { type: "month(s)" | "week(s)" | "day(s)" | "hour(s)" | "minute(s)" | "second(s)", time: number };
            if (timeLeftWhole > 2629800) { timeLeft = { type: "month(s)", time: timeLeftWhole / 2629800 } }
            if (timeLeftWhole > 604800) { timeLeft = { type: "week(s)", time: timeLeftWhole / 604800 }; };
            if (timeLeftWhole > 86400) { timeLeft = { type: "day(s)", time: timeLeftWhole / 86400 } };
            if (timeLeftWhole > 3600) { timeLeft = { type: "hour(s)", time: timeLeftWhole / 3600 } };
            if (timeLeftWhole > 60) { timeLeft = { type: "minute(s)", time: timeLeftWhole / 60 } }
            if (timeLeftWhole < 60) { timeLeft = { type: "second(s)", time: timeLeftWhole } };
            return message.reply({
              embeds: [
                new Embed({
                  description: `>>> **Slow down there,** Please wait another \`${Math.round(
                    timeLeft.time
                  )}\` ${timeLeft.type}.`,
                }),
              ],
            });;
        } else {
            await Cooldowns.findOneAndRemove({ userId, command: command.name });
            cooldowns(command, userId, message, commandParmas)
        }
    } else {
        await Cooldowns.create({
          userId,
          command: command.name,
          length: command.cooldown,
          now: Date.now(),
        });
        command.execute(commandParmas)
        
    }
}

export default cooldowns