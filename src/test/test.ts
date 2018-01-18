import Server from "../isotropy-webserver";
import request = require("supertest");
import "mocha";
import "should";

describe("isotropy-webserver", async () => {
  it("Handles GET requests", async () => {
    const app = new Server();
    app.addRoutes([
      [
        "GET",
        "/hello",
        async ctx => {
          ctx.body = "hello, world";
        }
      ]
    ]);
    const response = await request(app)
      .get("/hello")
      .set("Accept", "application/json")
      .expect(200);

    response.text.should.equal("hello, world");
  });

  it("Handles GET requests returing JSON", async () => {
    const app = new Server();
    app.addRoutes([
      [
        "GET",
        "/hello",
        async ctx => {
          ctx.body = { hello: "world" };
        }
      ]
    ]);
    const response = await request(app)
      .get("/hello")
      .set("Accept", "application/json")
      .expect(200);

    response.body.should.deepEqual({ hello: "world" });
  });
});
