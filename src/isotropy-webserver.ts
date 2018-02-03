import { Context, Request, Response, Middleware } from "koa";
import Koa = require("koa");
import Router = require("koa-router");
import koaBody = require("koa-body");
import exception from "./exception";
import { Server } from "http";

export type Route = [
  string,
  string,
  (context: Context, next: any) => void
];

export default class IsotropyServer {
  app: Koa;
  router: Router;
  __instance: any;

  constructor() {
    this.app = new Koa();
    this.app.use(koaBody());

    this.router = new Router();
  }

  address() {
    return this.__instance ? this.__instance.address() : undefined;
  }

  addRoutes(routes: Route[]) {
    routes.forEach(route => {
      const [method, url, handler]: Route = route;
      const _method = method.toUpperCase();

      (_method === "GET"
        ? this.router.get
        : _method === "POST"
          ? this.router.post
          : _method === "PUT"
            ? this.router.put
            : _method === "DELETE"
              ? this.router.del
              : _method === "PATCH"
                ? this.router.patch
                : _method === "OPTIONS"
                  ? this.router.options
                  : exception(`Invalid method ${_method} in routes.`)
      ).call(this.router, url, handler);
    });
    this.app.use(this.router.routes());
  }

  get middleware() {
    return this.app.middleware;
  }

  use(middleware: Middleware) {
    return this.app.use(middleware);
  }

  listen(port: number) {
    this.__instance = !this.__instance
      ? this.app.listen(port)
      : exception(
          `Called listen() twice. Try removing listen() from your code.`
        );
    return this.__instance;
  }
}
