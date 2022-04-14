import { RouteTypes } from "../../typings/classTypes";

export class APIRoute {
    constructor(options: RouteTypes) {
        Object.assign(this, options)
    }
}