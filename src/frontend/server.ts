import express from "express";
import { RouteHandler } from "./Routes";
import cors from "cors";
import { client } from "..";
const app = express();

app.use(cors({ origin: `http://127.0.0.1:3000` }));
app.set("json spaces", 1);
app.set("view engine", "ejs");
app.set("views", process.cwd() + "/src/frontend/views");
app.use(express.static(process.cwd() + "/src/frontend/views"));

const APIMain = async () => {
  RouteHandler(app);
  app.listen(8000, () =>
    client.logger.info(
      `Dash is now online! URL: http://localhost`
    )
  );
};

export default APIMain;
