import chalk from "chalk";
import { client } from "../../..";
import { numberFormat } from "../../modules/formatters";
import genNewAPIKey from "../../modules/genNewAPIKey";
import { Event } from "../../structures/Event";

export default new Event(`ready`, async () => {
  client.APIKey = await genNewAPIKey();
   client.user.setActivity(
     `${numberFormat(client.users.cache.size)} users | /help`
  );
  setInterval(() => {  client.user.setActivity(
    `${numberFormat(client.users.cache.size)} users | /help`
  ); }, 1000 * 60 * 10)
  client.logger.info(
    `Client (${chalk.redBright(`${client.user.tag}`)}) is now online!`
  );
});
