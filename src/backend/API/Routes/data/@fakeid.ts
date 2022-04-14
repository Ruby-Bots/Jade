import genNewKey from "../../../modules/newKey";
import { APIRoute } from "../../../structures/Routes";

export default new APIRoute({
  name: `@fakeid`,
  execute: async (req, res, { client }) => {
    res.status(200).send({ token: `${await genNewKey(59, { includeDots: true })}`, code: 200})
  },
});
