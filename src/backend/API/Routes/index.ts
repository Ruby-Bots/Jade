import glob from "glob";
import { promisify } from "util";
import { client } from "../../..";
import { RouteTypes } from "../../../typings/classTypes";
import { importFile } from "../../structures/Client";
const globPromise = promisify(glob);

export const APIRouteHandler = async (app) => {
  const APIFiles: string[] = await globPromise(
    `${__dirname}/../../backend/API/Routes/**/*{.ts,.js}`
  );
  APIFiles.forEach(async (filePath) => {
    const route: RouteTypes = await importFile(filePath);
    if (!route.name) return;
    const middleware = [];
    if (route.middleware) {
      route.middleware.forEach((mw) => {
        middleware.push(mw);
      });
    }
    app.get(`/${route.name}`, middleware, async (req, res) => {
      route.execute(req, res, { client: client });
    });
  });
  app.get("/", (req, res) =>
    res.send({ msg: `Jade API`, status: `Soon! / Private`, code: 200 })
  );
};
