import request from "supertest";
import { createApp } from "../config/app.js";
import dbPool from "../config/connection.js";

describe("Sharing API Integration Tests", () => {
  let app;
  let accessToken;
  let testSharingId;

  beforeAll(async () => {
    app = createApp();

    // Simulate user login to get access token
    const loginResponse = await request(app).post("/signin").send({
      email: "testuser3@example.com",
      password: "Password123",
    });
    accessToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    if (testSharingId) {
      await request(app)
        .delete(`/sharing/${testSharingId}`)
        .set("Authorization", `Bearer ${accessToken}`);
    }
    await dbPool.end(); // Close database connection
  });

  test("POST /sharing - should create a new post", async () => {
    const res = await request(app)
      .post("/sharing")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "Integration test post" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.dataPost).toHaveProperty(
      "content",
      "Integration test post"
    );

    testSharingId = res.body.dataPost.sharing_id;
  });

  test("GET /sharing - should return list of shared content", async () => {
    const res = await request(app)
      .get("/sharing")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
