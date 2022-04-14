import { GuildMember } from "discord.js";
import Leveling from "../../../../schemas/Collections/Guilds/Leveling";
import Levels, { User } from "../../../../schemas/Collections/Users/Levels";
import messageDelete from "../../../modules/messageDelete";
import { Event } from "../../../structures/Event";

const LevelingFormat = (str: string, member: GuildMember, userData: User) => {
  let msg = str;
  const values = [
    { key: `{{level}}`, value: `${userData.level}` },
    { key: `{{user#tag}}`, value: `${member.user.tag}` },
    { key: `{{user#id}}`, value: `${member.user.id}` },
    { key: `{{user#mention}}`, value: `<@${member.user.id}>` },
    { key: `{{user#username}}`, value: `${member.user.tag}` },
    { key: `{{xp}`, value: `${userData.xp}` },
    { key: `{{requiredxp}`, value: `${userData.requiredXp}` },
  ];
  for (let { key, value } of values) msg.replace(new RegExp(key, "igm"), value);
  return msg;
};

export default new Event(`messageCreate`, async (message) => {
  if (message.author.bot) return;
  let messageCount = 0;
  const LevelingData = await Leveling.findOne({ guildId: message.guild.id });
  let userLevels = await Levels.findOne({
    userId: message.author.id,
    guildId: message.guild.id,
  });
  if (!userLevels)
    await Levels.create({
      userId: message.author.id,
      guildId: message.guild.id,
    });
  userLevels = await Levels.findOne({
    userId: message.author.id,
    guildId: message.guild.id,
  });

  messageCount = messageCount + 1;
  if (!LevelingData || LevelingData.toggle === false || messageCount < 5)
    return;
  const randomXp = Math.floor(Math.random() * 25) + 25;
  await Levels.findOneAndUpdate(
    { userId: message.author.id, guildId: message.guild.id },
    {
      xp: userLevels.xp + randomXp,
    }
  );
  if (userLevels.xp >= userLevels.requiredXp) {
    const newRequiredXp =
      Math.floor(Math.random() * userLevels.requiredXp) + userLevels.requiredXp;
    await Levels.findOneAndUpdate(
      {
        userId: message.author.id,
        guildId: message.guild.id,
      },
      { requiredXp: newRequiredXp, level: userLevels.level + 1 }
    );

    message.channel
      .send({
        content: `${LevelingFormat(
          LevelingData.message,
          message.guild.members.cache.find((m) => m.id === message.author.id),
          userLevels
        )}`,
      })
      .then((msg) => messageDelete(msg, 5000));
  }
});
