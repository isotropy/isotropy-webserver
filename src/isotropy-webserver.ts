import { Context, Request, Response } from "koa";
import { NextFunction } from "express-serve-static-core";

export interface Route {
  method: string;
  url: string;
  handler: (context: Context, next: NextFunction) => void;
}

export default class Server {
  routes: ;

  constructor() {
    this.router = new Router();
  }


}