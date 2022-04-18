import { Route } from "../../structures/Route";

export default new Route({
    name: `/invite`,
    execute: async (req, res, { }) => {
        res.redirect(process.env.INVITE)
    }
})