import axios from "axios";
import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";

export default new Command({
    name: `token`,
    description: `💾 | Generate a **fake** token / id!`,
    category: "api",
    execute: async ({ ctx, client}) => {
        const data = (await axios.get(`http://localhost:${process.env.PORT || 3000}/@fakeid`)).data;
        if (!data) {
            return ctx.reply({ embeds: [new Embed({ description: `Failed to fetch an token!`})]})
        }
        ctx.reply({ ephemeral: true, embeds: [new Embed({ title: `Token/Id Generated`, description: `||\`${data.token}\`||`})]})
    }
})