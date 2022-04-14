import passport from "passport";
import genNewKey from "../../../modules/newKey";
import { APIRoute } from "../../../structures/Routes";

export default new APIRoute({
  name: `login`,
  execute: async (req, res, { client }) => {
    res.status(200).send({ msg: "Comming soon!"})
    //res.redirect(process.env.LOGIN_URL)
  },
});
