import { model, Schema } from "mongoose";

export interface Guild {
}

export default model(
  "Guilds/Main",
  new Schema<Guild>({
    
  })
);
