import { Command } from "../../../structures/Command";

export default new Command({
  name: `warn`,
  description: `🔨 | Manage a users warnings!`,
  userPermissions: ["MANAGE_MESSAGES"],
  category: "Moderation",
  options: [
    {
      type: "SUB_COMMAND",
      name: "add",
      description: "🔨 | Add an new warning!",
      options: [
        {
          type: "USER",
          name: "user",
          description: `🔨 | The member you wish to warn!`,
          required: true,
        },
        {
          type: "STRING",
          name: "reason",
          description: `🔨 | The warning reason!`,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "remove",
      description: "🔨 | Remove an new warning!",
      options: [
        {
          type: "STRING",
          description: `🔨 | The warning id!`,
          name: "warn_id",
          required: true,
        },
      ],
    },
  ],
  execute: async ({ ctx, args }) => {},
});