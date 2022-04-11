import { config } from "dotenv";
import Jade from "./backend/structures/Client";
import dash from "./frontend/server";
export const client = new Jade();
config();
client.start();
dash();
