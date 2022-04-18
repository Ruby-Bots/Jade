import Levels from "../../../schemas/Collections/Users/Levels";
import { Route } from "../../structures/Route";

export default new Route({
    name: `/leaderboard/:id`,
    execute: async (req, res, { client }) => {
        const { id } = req.params;
        const guild = client.guilds.cache.find(g => g.id === id)
        if (!id || !guild) return res.redirect("/");
        const users = [];
        const ar = await Levels.find({ guildId: id })
        ar.forEach((doc) => {
            users.push(doc)
        })
        const sorttedUsers = users.sort((a, b) => (b.xp - a.xp))
        console.log(users, sorttedUsers)
        const formattedUsers = [];
        for (let i = 0; i < sorttedUsers.length; i++) {
            const user = guild.members.cache.find(m => m.id === sorttedUsers[i]._doc.userId)
            if (!user) return;
            formattedUsers.push({ pos: i + 1, avatar: user.user.displayAvatarURL({ format: "png" }), tag: user.user.tag, ...sorttedUsers[i]._doc})
        }
        if(!formattedUsers.length) return res.redirect("/")
         res.render("pages/dash/leaderboard.ejs", {
            users: formattedUsers,
            guild: guild
        })
    }
})