import glob from "glob";
import { promisify } from "util";
import { client } from "../..";
import { importFile } from "../../backend/structures/Client";
import { RouteTypes } from "../../typings/classTypes";
const globPromise = promisify(glob);

export const RouteHandler = async (app) => {
  const Files: string[] = await globPromise(
    `${__dirname}/../../frontend/Routes/**/*{.ts,.js}`
  );
  Files.forEach(async (filePath) => {
      const route: RouteTypes = await importFile(filePath);
    if (!route || !route.name) return;
    const middleware = [];
    if (route.middleware) {
      route.middleware.forEach((mw) => {
        middleware.push(mw);
      });
      }
    app.get(`${route.name}`, middleware, async (req, res) => {
      route.execute(req, res, { client: client });
    });
  });
};
