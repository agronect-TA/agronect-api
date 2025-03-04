import request from "supertest";
import { createApp } from "../config/app.js";
import dbPool from "../config/connection.js";

describe("Sharing API Integration Tests", () => {
  let app;
  let accessToken;
  let testSharingId;
  let testUserId;

  beforeAll(async () => {
    app = createApp();

    // Simulate user login to get access token and user ID
    const loginResponse = await request(app).post("/signin").send({
      email: "testuser3@example.com",
      password: "Password123",
    });
    accessToken = loginResponse.body.access_token;
    testUserId = loginResponse.body.user_id; // Extract user ID from login response
  });

  afterEach(async () => {
    if (testSharingId) {
      await dbPool.execute("DELETE FROM sharing WHERE sharing_id = ?", [
        testSharingId,
      ]);
    }
  });

  afterAll(async () => {
    await dbPool.end(); // Close database connection
  });

  test("POST /sharing - should create a new post", async () => {
    const res = await request(app)
      .post("/sharing")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "Integration test post", user_id: testUserId });

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

  test("GET /sharing/:id - should return sharing details for a valid ID", async () => {
    const postRes = await request(app)
      .post("/sharing")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "Test post for ID", user_id: testUserId });

    testSharingId = postRes.body.dataPost.sharing_id;

    const res = await request(app)
      .get(`/sharing/${testSharingId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.sharing_id).toBe(testSharingId);
  });

  test("GET /sharing/:id - should return 404 if sharing ID does not exist", async () => {
    const res = await request(app)
      .get("/sharing/unknown_id")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Sharing not found");
  });

  test("GET /sharing/user/:user_id - should return sharing for a valid user", async () => {
    const postRes = await request(app)
      .post("/sharing")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "Test post for user", user_id: testUserId });

    testSharingId = postRes.body.dataPost.sharing_id;

    const res = await request(app)
      .get(`/sharing/users/${testUserId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /sharing/user/:user_id - should return 404 if no sharing found", async () => {
    const res = await request(app)
      .get("/sharing/users/unknown_user")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No sharing found for this user");
  });

  test("PUT /sharing/:id - should update sharing content", async () => {
    const postRes = await request(app)
      .post("/sharing")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "Test post for update" });

    testSharingId = postRes.body.dataPost.sharing_id;

    const res = await request(app)
      .put(`/sharing/${testSharingId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "Updated content" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.dataUpdate.content).toBe("Updated content");
  });

  test("DELETE /sharing/:id - should delete sharing", async () => {
    const postRes = await request(app)
      .post("/sharing")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "Test post for delete" });

    testSharingId = postRes.body.dataPost.sharing_id;

    const res = await request(app)
      .delete(`/sharing/${testSharingId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
  });
});
