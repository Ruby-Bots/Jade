import {
  ButtonInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  SelectMenuInteraction,
} from "discord.js";
import { ExtendedInteraction } from "../../typings/classTypes";
import Jade from "../structures/Client";

export interface CategoryOptions {
  label: string;
  value: string;
}
export interface Page {
  id: string;
  embed: Array<MessageEmbed>;
}

const Pagination = async (
  pages: Array<Page>,
  interaction: ExtendedInteraction | ButtonInteraction | SelectMenuInteraction,
  client: Jade,
  categorys?: Array<CategoryOptions>,
  dropdownPlaceholder?: string,
) => {
  try {
    let dropdown;
  if (categorys) {
    dropdown = new MessageActionRow().addComponents([
      new MessageSelectMenu()
        .addOptions(categorys)
        .setCustomId("command_dropdown")
        .setPlaceholder(dropdownPlaceholder || "Choose a category"),
    ]);
  }
  const buttons = new MessageActionRow().addComponents([
    new MessageButton()
      .setEmoji(`${client.config.emojis.left_skip}`)
      .setStyle("PRIMARY")
      .setDisabled(true)
      .setCustomId("first_page"),
    new MessageButton()
      .setEmoji(`${client.config.emojis.left_arrow}`)
      .setStyle("PRIMARY")
      .setDisabled(true)
      .setCustomId("back_page"),
    new MessageButton()
      .setEmoji(`${client.config.emojis.right_arrow}`)
      .setStyle("PRIMARY")
      .setCustomId("forward_page"),
    new MessageButton()
      .setEmoji(`${client.config.emojis.right_skip}`)
      .setStyle("PRIMARY")
      .setCustomId("last_page"),
  ]);
  const firstPage = pages[0].embed[0];
  let currentCategory = pages[0].id;
  let currentpages: Array<MessageEmbed>;
  pages.map((p) => {
    if (p.id === currentCategory) {
      currentpages = p.embed;
    }
  });
  if (currentpages.length === 1) {
    buttons.components[0].setDisabled(true);
    buttons.components[1].setDisabled(true);
    buttons.components[2].setDisabled(true);
    buttons.components[3].setDisabled(true);
  }
  const components = [];
  if (dropdown) {
    components.push(dropdown);
  }
  components.push(buttons);
  interaction
    .reply({
      ephemeral: true,
      components: components,
      embeds: [firstPage],
    })
    .catch((err) => { console.log(err)});
  let pageOnEnd;
  const collector = interaction.channel.createMessageComponentCollector({
    time: 35000,
  });
   let page = 0;
  collector.on("collect", async (i) => {
    if (i.user.id !== interaction.user.id || i.user.bot) return;
    await i.deferUpdate();
     if (i.isButton()) {
       switch (i.customId) {
         case "first_page":
           page = 0;
           break;
         case "last_page":
           page = currentpages.length - 1;
           break;
         case "back_page":
           page = page > 0 ? --page : 0;
           break;
         case "forward_page":
           page = page < currentpages.length - 1 ? ++page : currentpages.length - 1;
           break;
       }
       if (page === currentpages.length - 1) {
         buttons.components[0].setDisabled(false);
         buttons.components[1].setDisabled(false);
         buttons.components[2].setDisabled(true);
         buttons.components[3].setDisabled(true);
       }
       if (page === 0) {
         buttons.components[0].setDisabled(true);
         buttons.components[1].setDisabled(true);
         buttons.components[2].setDisabled(false);
         buttons.components[3].setDisabled(false);
       }
       if (page !== 0 && page !== currentpages.length - 1) {
         buttons.components[0].setDisabled(false);
         buttons.components[1].setDisabled(false);
         buttons.components[2].setDisabled(false);
         buttons.components[3].setDisabled(false);
       }

       interaction
         .editReply({
           components: components,
           embeds: [currentpages[page]],
         })
         .catch(() => {
           collector.stop("error");
         });
     }
    if (i.isSelectMenu()) {
      const value = i.values[0];
      pages.forEach((p) => {
        if (p.id === value) {
          currentCategory = value;
        }
      });
      pages.map((p) => {
        if (p.id === currentCategory) {
          currentpages = p.embed;
        }
      });
      page = 0;
      if (currentpages.length > 1) {
        buttons.components[0].setDisabled(true);
        buttons.components[1].setDisabled(true);
        buttons.components[2].setDisabled(false);
        buttons.components[3].setDisabled(false);
      }
      if (currentpages.length === 1) {
        buttons.components[0].setDisabled(true);
        buttons.components[1].setDisabled(true);
        buttons.components[2].setDisabled(true);
        buttons.components[3].setDisabled(true);
      }
      interaction
        .editReply({
          components: components,
          embeds: [currentpages[page]],
        })
        .catch(() => {
          collector.stop("error");
        });
      pageOnEnd = page;
    }
  });

  collector.on("end", (c, r) => {
    buttons.components[0].setDisabled(true);
    buttons.components[1].setDisabled(true);
    buttons.components[2].setDisabled(true);
    buttons.components[3].setDisabled(true);
    dropdown.components[0].setDisabled(true);
    interaction
      .editReply({
        components: components,
        embeds: [currentpages[pageOnEnd]],
      })
      .catch(() => {});
  });
  } catch (err) {
    client.logger.error(err)
    client.sendCommandError(
      interaction as ExtendedInteraction,
      false,
      `>>> \`\`\err\n${err}\n\`\`\``,
      false,
      {
        token: process.env.DEFAULT_ERROR_WEBHOOK_TOKEN,
        id: process.env.DEFAULT_ERROR_WEBHOOK_ID,
      },
      "Pagination error!"
    );
 }
};

export default Pagination;
