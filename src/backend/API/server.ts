import express from "express";
import { APIRouteHandler } from "./Routes";
import cors from "cors";
import { client } from "../..";
const app = express();

app.use(cors({ origin: `http://127.0.0.1:8000` }));

const APIMain = async () => {
  app.get("/", (req, res) => {
    res.status(200).send({ msg: `Jade API!` });
  });
  APIRouteHandler(app);
  app.listen(process.env.PORT || 3000, () =>
    client.logger.info(
      `API is now online! URL: http://api.localhost`
    )
  );
};

export default APIMain;
