import { MessageActionRow, MessageButton } from "discord.js";

export default new MessageActionRow().addComponents([
  new MessageButton()
    .setLabel("Invite")
    .setURL(process.env.URL)
    .setStyle("LINK"),
  new MessageButton()
    .setLabel("Source")
    .setURL("https://github.com/Saigeie/Jadebot.app")
    .setStyle("LINK"),
  new MessageButton()
    .setLabel("Source")
    .setURL(process.env.SUPPORT_URL)
    .setStyle("LINK"),
]);
