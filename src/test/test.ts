import Server from "../isotropy-webserver";
import request = require("supertest");
import "mocha";
import "should"

describe("isotropy-webserver", async () => {
  it("Handles GET requests", async () => {
    const app = new Server();
    app.addRoutes([["GET", "/hello", async ctx => { ctx.body = "hello, world"; }]]);
    app.listen(8080);
    const response = await request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect(200);

    response.body.should.equal("hello, world")
  })
});