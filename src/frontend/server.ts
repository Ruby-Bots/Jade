import express from "express";
import { client } from "..";
import { APIRouteHandler } from "./Routes";

const app = express();

const Main = async () => {
  app.get("/", (req, res) => {
    res.send({ msg: `Jade`, status: `Coming soon!`, code: 404 });
  });
  APIRouteHandler(app);
  app.listen(process.env.PORT || 3000, () =>
    client.logger.info(
      `Dashboard is now online! URL: http://localhost:${
        process.env.PORT || 3000
      }`
    )
  );
};

export default Main;
