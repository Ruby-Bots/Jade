import { RouteTypes } from "../../typings/classTypes";

export class Route {
  constructor(options: RouteTypes) {
    Object.assign(this, options);
  }
}
