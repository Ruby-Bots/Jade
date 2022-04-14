import passport from "passport";
import genNewKey from "../../../modules/newKey";
import { APIRoute } from "../../../structures/Routes";

export default new APIRoute({
  name: `logout`,
  execute: async (req, res, { client }) => {
    res.status(200).send({ msg: "Comming soon!" });
    // res.clearCookie("connect.sid");
    // res.redirect("/");
  },
});
