import getGuilds from "../../../modules/guilds";
import { apikey } from "../../../modules/middleware/apikey";
import { APIRoute } from "../../../structures/Routes";
export default new APIRoute({
  name: `data/@me`,
  middleware: [apikey],
  execute: async (req, res, { client }) => {
    const guilds = await getGuilds();
    if (!client) return res.redirect("/api");
    setTimeout(() => {
      res.send({
        "@me": {
          id: client.user.id,
          discriminator: client.user.discriminator,
          username: client.user.username,
          guilds: guilds,
          config: client.config,
        },
        stats: {
          guildSize: client.guilds.cache.size,
          userSize: client.users.cache.size,
          ping: client.ws.ping,
        },
      });
    }, 1000);
  },
});
