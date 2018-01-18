import Koa, { Context, Request, Response, Middleware } from "koa";
import Router from "koa-router";
import koaBody from "koa-body"
import { NextFunction } from "express-serve-static-core";
import exception from "./exception";

export interface Route {
  method: string;
  url: string;
  handler: (context: Context, next: NextFunction) => void;
}

export default class Server {
  app: Koa;
  router: Router;

  constructor() {
    this.app = new Koa();
    this.app.use(koaBody());
    
    this.router = new Router();
  }

  addRoutes(routes: Route[]) {
    routes.forEach(route => 
      (route.method === "get" ? this.router.get
        : route.method === "post" ? this.router.post
          : route.method === "put" ? this.router.put
            : route.method === "del" ? this.router.del
              : route.method === "patch" ? this.router.patch
                : route.method === "options" ? this.router.options
                  : exception(`Invalid method ${route.method} in routes.`)
    ).call(this.router, route.url, route.handler));
    this.app.use(this.router.routes());
  }

  use(middleware: Middleware) {
    this.app.use(middleware);
  }

  listen(port: number) {
    this.app.listen(port)
  }
}