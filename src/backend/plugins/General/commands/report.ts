import { Command } from "../../../structures/Command";
import { Embed } from "../../../structures/Embed";

export default new Command({
  name: `report`,
  description: `🏡 | Report an error to the developer.`,
  category: "General",
  cooldown: 60 * 1000 * 15,
  options: [{ type: "STRING", name: "id", description: "🏡 | The error id", required: true }, { type: "STRING", name: "information", description: "🏡 | Anymore information about the error", required: false}],
  execute: async ({ ctx, client, args }) => {
      const string = args.getString("id");
      const info = args.getString("information") || "No other information"
      if (!client.errorIds.includes(string)) {
          return ctx.reply({ embeds: [new Embed({ description: `>>> Can not find a recent error under the id of \`${string}\``})]})
      }
      client.sendCommandError(ctx, false, `>>> **ID**: \`${string}\`\n**Other Info**:\n\`\`\`\n${info}\`\`\``, false, { token: process.env.REPORT_WEBHOOK_TOKEN, id: process.env.REPORT_WEBHOOK_ID}, "New Report!")
      ctx.channel.send({
          embeds: [new Embed({
              description: `Your report (\`${string}\`) has been submitted.`
        })]})
  
    },
});