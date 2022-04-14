import { numberFormat } from "../../../backend/modules/formatters";
import { Route } from "../../structures/Route";

export default new Route({
  name: `/`,
  execute: async (req, res, { client }) => {
    res.render("pages/home.ejs", {
      userCount: numberFormat(client.users.cache.size),
    });
  },
});
