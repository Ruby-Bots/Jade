import {
  ButtonInteraction,
  ColorResolvable,
  CommandInteractionOptionResolver,
  GuildMember,
  Message,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  TextChannel,
} from "discord.js";
import { client } from "../../..";
import Suggestions from "../../../schemas/Collections/Guilds/Suggestions";
import { ExtendedInteraction } from "../../../typings/classTypes";
import messageDelete from "../../modules/messageDelete";
import { Embed } from "../../structures/Embed";

const suggestionFormat = (
  str: string,
  member: GuildMember,
  reason: String,
  id: String
) => {
  let msg = str;
  const values = [
    { key: `{{reason}}`, value: `${reason}` },
    { key: `{{user#tag}}`, value: `${member.user.tag}` },
    { key: `{{user#id}}`, value: `${member.user.id}` },
    { key: `{{user#mention}}`, value: `<@${member.user.id}>` },
    { key: `{{user#username}}`, value: `${member.user.tag}` },
    { key: `{{id}}`, value: `${id}` },
  ];
  for (let { key, value } of values) msg.replace(new RegExp(key, "igm"), value);
  return msg;
};

export const AcceptSuggestion = async (
  ctx: ExtendedInteraction,
  args: CommandInteractionOptionResolver
) => {
  const suggestionConfig = await Suggestions.findOne({ guildId: ctx.guild.id });
  const messageId = args.getString("messageid");
  const reason = args.getString("reason") || "No reason supplied!";
  if (!suggestionConfig.channelId) {
    return ctx.reply({
      embeds: [
        new Embed({
          description: `You must setup suggestions first before being able to use this command!`,
        }),
      ],
    });
  }

  const channel = ctx.guild.channels.cache.find(
    (c) => c.id === suggestionConfig.channelId
  ) as TextChannel;
  if (!channel) {
    return ctx.reply({
      embeds: [
        new Embed({
          description: `It appears you suggestions channel has been deleted! Please set a new one to begin using these commands again.`,
        }),
      ],
    });
  }
  const message = await (await channel.messages.fetch())
    .filter((f) => f.id === messageId)
    .toJSON()[0];
  const embed = message?.embeds[0];
  if (!embed) {
    return ctx.reply({
      embeds: [
        new Embed({
          description: `It appears this is not a suggestion message!`,
        }),
      ],
    });
  }
  if (embed.fields[0]?.name.includes("Accepted")) {
    return ctx.reply({
      embeds: [
        new Embed({
          description: `It appears that this suggestion has already been accepted!`,
        }),
      ],
    });
  }
  delete embed.color;
  embed["fields"] = [
    {
      name: `\`${client.config.emojis.tick}\` Accepted!`,
      value: `>>> ${reason}`,
      inline: false,
    },
  ];
  message.reactions.removeAll();
  message.edit({
    components: [],
    embeds: [
      new Embed({
        color: "GREEN",
        ...embed,
      }),
    ],
  });
  ctx.reply({
    embeds: [
      new Embed({
        description: `Suggestion (\`${messageId}\`) has successfully been accepted`,
      }),
    ],
  });
  if (suggestionConfig.dmResponse) {
    const member = ctx.guild.members.cache.find(
      (m) => m.id === message.author.id
    );
    if (!member) return;
    message.author
      .send({
        embeds: [
          new Embed({
            description: `${suggestionFormat(
              suggestionConfig.accept_message,
              member,
              reason,
              message.id
            )}`,
          }),
        ],
      })
      .catch((err) => {
        ctx.channel
          .send({
            embeds: [
              new Embed({
                description: `There was an error dming the suggester. Please notify them that there suggestion has been accepted some other way!`,
              }),
            ],
          })
          .then((msg) => {
            messageDelete(msg, 5000);
          });
      });
  }
};

export const DenySuggestion = async (
  ctx: ExtendedInteraction,
  args: CommandInteractionOptionResolver
) => {
  const suggestionConfig = await Suggestions.findOne({ guildId: ctx.guild.id });
  const messageId = args.getString("messageid");
  const reason = args.getString("reason") || "No reason supplied!";
  if (!suggestionConfig.channelId) {
    return ctx.reply({
      embeds: [
        new Embed({
          description: `You must setup suggestions first before being able to use this command!`,
        }),
      ],
    });
  }

  const channel = ctx.guild.channels.cache.find(
    (c) => c.id === suggestionConfig.channelId
  ) as TextChannel;
  if (!channel) {
    return ctx.reply({
      embeds: [
        new Embed({
          description: `It appears you suggestions channel has been deleted! Please set a new one to begin using these commands again.`,
        }),
      ],
    });
  }
  const message = await (await channel.messages.fetch())
    .filter((f) => f.id === messageId)
    .toJSON()[0];
  const embed = message?.embeds[0];
  if (!embed) {
    return ctx.reply({
      embeds: [
        new Embed({
          description: `It appears this is not a suggestion message!`,
        }),
      ],
    });
  }
  if (embed.fields[0]?.name.includes("Denied")) {
    return ctx.reply({
      embeds: [
        new Embed({
          description: `It appears that this suggestion has already been denied!`,
        }),
      ],
    });
  }
  delete embed.color;
  embed["fields"] = [
    {
      name: `\`${client.config.emojis.cross}\` Denied!`,
      value: `>>> ${reason}`,
      inline: false,
    },
  ];
  message.reactions.removeAll();
  message.edit({
    components: [],
    embeds: [
      new Embed({
        color: client.config.colors.red as ColorResolvable,
        ...embed,
      }),
    ],
  });
  ctx.reply({
    embeds: [
      new Embed({
        description: `Suggestion (\`${messageId}\`) has successfully been denied`,
      }),
    ],
  });
  if (suggestionConfig.dmResponse) {
    const member = ctx.guild.members.cache.find(
      (m) => m.id === message.author.id
    );
    if (!member) return;
    message.author
      .send({
        embeds: [
          new Embed({
            description: `${suggestionFormat(
              suggestionConfig.deny_message,
              member,
              reason,
              message.id
            )}`,
          }),
        ],
      })
      .catch((err) => {
        ctx.channel
          .send({
            embeds: [
              new Embed({
                description: `There was an error dming the suggester. Please notify them that there suggestion has been accepted some other way!`,
              }),
            ],
          })
          .then((msg) => {
            messageDelete(msg, 5000);
          });
      });
  }
};

export const AwaitSuggestion = async (
  ctx: ExtendedInteraction,
  args: CommandInteractionOptionResolver
) => {
  const suggestionConfig = await Suggestions.findOne({
    guildId: ctx.guild.id,
  });
  const messageId = args.getString("messageid");
  if (!suggestionConfig.channelId) {
    return ctx.reply({
      embeds: [
        new Embed({
          description: `You must setup suggestions first before being able to use this command!`,
        }),
      ],
    });
  }

  const channel = ctx.guild.channels.cache.find(
    (c) => c.id === suggestionConfig.channelId
  ) as TextChannel;
  if (!channel) {
    return ctx.reply({
      embeds: [
        new Embed({
          description: `It appears you suggestions channel has been deleted! Please set a new one to begin using these commands again.`,
        }),
      ],
    });
  }
  const message = await (await channel.messages.fetch())
    .filter((f) => f.id === messageId)
    .toJSON()[0];
  const embed = message?.embeds[0];
  if (!embed) {
    return ctx.reply({
      embeds: [
        new Embed({
          description: `It appears this is not a suggestion message!`,
        }),
      ],
    });
  }
  if (
    !embed.fields[0]?.name.includes("Denied") &&
    !embed.fields[0]?.name.includes("Accepted")
  ) {
    return ctx.reply({
      embeds: [
        new Embed({
          description: `It appears this suggestion is already in its "await" stage!`,
        }),
      ],
    });
  }
  delete embed.color;
  embed.fields ? delete embed.fields : null;
  message.edit({
    embeds: [
      new Embed({
        color: client.config.colors.gold as ColorResolvable,
        ...embed,
      }),
    ],
  });
  ctx.reply({
    embeds: [
      new Embed({
        description: `Suggestion (\`${messageId}\`) has successfully been put back into the "await" stage!`,
      }),
    ],
  });
};

export const UpdateChannel = async (
  ctx: ExtendedInteraction,
  args: CommandInteractionOptionResolver
) => {
  let dropdowns = [];
  const channels = [];
  ctx.guild.channels.cache
    .filter(
      (f) =>
        f.type === "GUILD_TEXT" &&
        f
          .permissionsFor(ctx.guild.me)
          .has(["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES"])
    )
    .sort((a: TextChannel, b: TextChannel) => a.position - b.position)
    .forEach((channel) => {
      channels.push({
        label: `${channel.name} - ${channel.parent.name || "No category"}`,
        value: `${channel.id}`,
      });
    });
  for (let i = 0; i < channels.length; i++) {
    dropdowns.push(
      new MessageActionRow().addComponents([
        new MessageSelectMenu()
          .addOptions(channels.splice(0, 24))
          .setCustomId(`suggestion_channel_dropdown_id_${i}`),
      ])
    );
  }
  ctx.reply({
    components: dropdowns,
    embeds: [
      new Embed({
        title: `Suggestion Channel!`,
        description: `>>> Please select one of the channels below, once selected it will be set as the channel were users must submit there suggestions!`,
      }),
    ],
  });
  let channelId;
  const collector = ctx.channel.createMessageComponentCollector({
    componentType: "SELECT_MENU",
  });
  collector.on("collect", (i) => {
    if (i.user.id !== ctx.user.id || i.user.bot)
      return i.reply({
        embeds: [
          new Embed({
            description: `This prompt can only be ran by **${ctx.user.tag}**`,
          }),
        ],
      });
    channelId = `${i.values[0]}`;
    return collector.stop("end");
  });
  collector.on("end", async (c, r) => {
    if (r.toLowerCase() === "end") {
      await Suggestions.findOneAndUpdate(
        { guildId: ctx.guild.id },
        {
          channelId: channelId,
        }
      );
      const channel = ctx.guild.channels.cache.find((f) => f.id === channelId);
      ctx.editReply({
        components: [],
        embeds: [
          new Embed({
            description: `Suggestions channel has been updated to **${channel.name}** *(${channel.id})*`,
          }),
        ],
      });
      setTimeout(() => {
        ctx.deleteReply().catch(() => {});
      }, 5000);
    }
  });
};

export const UpdateMesasges = async (
  ctx: ExtendedInteraction,
  args: CommandInteractionOptionResolver
) => {
  ctx.reply({
    components: [
      new MessageActionRow().addComponents([
        new MessageButton()
          .setCustomId("edit_s_accept_message")
          .setLabel("Accept Message")
          .setStyle("SECONDARY"),
        new MessageButton()
          .setCustomId("edit_s_deny_message")
          .setLabel("Deny Message")
          .setStyle("SECONDARY"),
      ]),
    ],
    embeds: [
      new Embed({
        description: `Please select one of the buttons below to edit its message!`,
      }),
    ],
  });

  const collector = ctx.channel.createMessageComponentCollector({
    componentType: "BUTTON",
  });
  collector.on("collect", (i) => {
    if (i.user.id !== ctx.user.id || i.user.bot) return;
    if (i.customId === "edit_s_accept_message") {
      const acceptMessageCollector = i.channel.createMessageCollector({ time: 35000 });
      i.reply({
        embeds: [
          new Embed({
            description: `Please type the message you would like to use when a suggestion gets accepted!\n\n>>> **{{reason}}** - The accept reason!\n**{{id}}** - The suggestion id\n**{{user#tag}}** - The suggesters tag\n**{{user#id}}** - The suggesters id\n**{{user#mention}}** - Mention the suggester!\n**{{user#username}}** - The suggesters username`,
          }),
        ],
      });
      let response;
      acceptMessageCollector.on("collect", (msg) => {
        if (msg.author.id !== ctx.user.id || msg.author.bot) return;
        response = msg.content.slice(0, 1000)
        msg.delete().catch(() => {})
        return acceptMessageCollector.stop("finshed")
      })
      acceptMessageCollector.on("end", async (c, r) => {
        if (r.toLowerCase() === "finshed") {
          await Suggestions.findOneAndUpdate(
            { guildId: ctx.guild.id },
            {
              accept_message: response,
            }
          );
          i.editReply({
            embeds: [
              new Embed({
                description: `Accepted suggestion message has been collected and saved!`,
              }),
            ],
          });
          setTimeout(() => {
            i.deleteReply().catch(() => {});
          }, 5000);
        } else {
          i.editReply({
            embeds: [
              new Embed({
                description: `It appears you have ran out of time, You only have **35** seconds!`,
              }),
            ],
          });
          setTimeout(() => {
            i.deleteReply().catch(() => {});
          }, 5000);
        }
      })
    }
    if (i.customId === "edit_s_deny_message") {
      const denyMessageCollector = i.channel.createMessageCollector({
        time: 35000,
      });
      i.reply({
        embeds: [
          new Embed({
            description: `Please type the message you would like to use when a suggestion gets denied!\n\n>>> **{{reason}}** - The accept reason!\n**{{id}}** - The suggestion id\n**{{user#tag}}** - The suggesters tag\n**{{user#id}}** - The suggesters id\n**{{user#mention}}** - Mention the suggester!\n**{{user#username}}** - The suggesters username`,
          }),
        ],
      });
      let response;
      denyMessageCollector.on("collect", (msg) => {
        if (msg.author.id !== ctx.user.id || msg.author.bot) return;
        response = msg.content.slice(0, 1000);
        msg.delete().catch(() => {})
        return denyMessageCollector.stop("finshed");
      });
      denyMessageCollector.on("end", async (c, r) => {
        if (r.toLowerCase() === "finshed") {
          await Suggestions.findOneAndUpdate(
            { guildId: ctx.guild.id },
            {
              deny_message: response,
            }
          );
          i.editReply({
            embeds: [
              new Embed({
                description: `Denied suggestion message has been collected and saved!`,
              }),
            ],
          });
          setTimeout(() => {
            i.deleteReply().catch(() => {});
          }, 5000);
        } else {
          i.editReply({ embeds: [new Embed({ description: `It appears you have ran out of time, You only have **35** seconds!`})]})
          setTimeout(() => {
            i.deleteReply().catch(() => {});
          }, 5000);
        }
      });
    }
  });
};
