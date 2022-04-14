import passport from "passport";
import genNewKey from "../../../modules/newKey";
import { APIRoute } from "../../../structures/Routes";

export default new APIRoute({
  name: `auth/callback`,
  middleware: [passport.authenticate("discord", { failureRedirect: "/" })],
    execute: async (req, res, { client }) => {
        client.logger.info(`New auth login! (${req.params.code})`)
        setTimeout(() => {
          //@ts-ignore
        res.redirect(`${process.env.URL}?token=${req.user.token}`);
      }, 500);
  },
});
