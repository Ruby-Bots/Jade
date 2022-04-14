import { GuildInfo } from "passport-discord"
import { client } from "../..";

const getAdminGuilds = async (guild: Array<GuildInfo>, userId: string) => {
     const array = [];
     const adminUserGuilds = guild.filter(
       (f) => f.owner || (f.permissions & 0x20) === 0x20
     );
     adminUserGuilds.forEach((guild: GuildInfo) => {
       const isGuild = client.guilds.cache.find((g) => g.id === guild.id);
       array.push({
         joined: isGuild ? true : false,
         ...guild,
       });
     });
     return array.sort((a, b) => Number(b.joined) - Number(a.joined));
}

export default getAdminGuilds