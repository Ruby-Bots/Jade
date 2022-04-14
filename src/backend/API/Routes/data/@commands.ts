import { APIRoute } from "../../../structures/Routes";

export default new APIRoute({
    name: `data/@commands`,
    execute: async (req, res, { client }) => {
        res.status(200).send(client.commands);
    }
})