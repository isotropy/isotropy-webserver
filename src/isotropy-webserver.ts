import Koa, { Context, Request, Response, Middleware } from "koa";
import Router from "koa-router";
import koaBody from "koa-body"
import { NextFunction } from "express-serve-static-core";
import exception from "./exception";

export type Route = [string, string,
  (context: Context, next: NextFunction) => void
];

export default class Server {
  app: Koa;
  router: Router;

  constructor() {
    this.app = new Koa();
    this.app.use(koaBody());

    this.router = new Router();
  }

  addRoutes(routes: Route[]) {
    routes.forEach(route => {
      const [method, url, handler]: Route = route;

      (method === "get" ? this.router.get
        : method === "post" ? this.router.post
          : method === "put" ? this.router.put
            : method === "del" ? this.router.del
              : method === "patch" ? this.router.patch
                : method === "options" ? this.router.options
                  : exception(`Invalid method ${method} in routes.`)
      ).call(this.router, url, handler)
    });
    this.app.use(this.router.routes());
  }

  use(middleware: Middleware) {
    this.app.use(middleware);
  }

  listen(port: number) {
    this.app.listen(port)
  }
}