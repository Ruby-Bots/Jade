import { config } from "dotenv";
import Jade from "./backend/structures/Client";
import api from "./backend/API/server";
import dash from "./frontend/server";
export const client = new Jade();
config();
client.start();
api();
dash();