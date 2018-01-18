import { Context, Request, Response, Middleware } from "koa";
import Koa = require("koa");
import Router = require("koa-router");
import koaBody = require("koa-body")
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
      const _method = method.toUpperCase();

      (_method === "GET" ? this.router.get
        : _method === "POST" ? this.router.post
          : _method === "PUT" ? this.router.put
            : _method === "DELETE" ? this.router.del
              : _method === "PATCH" ? this.router.patch
                : _method === "OPTIONS" ? this.router.options
                  : exception(`Invalid method ${_method} in routes.`)
      ).call(this.router, url, handler)
    });
    this.app.use(this.router.routes());
  }

  use(middleware: Middleware) {
    this.app.use(middleware);
  }

  listen(port: number) {
    this.app.listen(port);
    return this.app;
  }
}