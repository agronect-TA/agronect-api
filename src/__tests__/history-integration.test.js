import request from "supertest";
import { createApp } from "../config/app.js";
import dbPool from "../config/connection.js";

import dotenv from "dotenv";
dotenv.config();

describe("History Management Integration Tests", () => {
  let app;
  let accessToken;
  let testHistoryId;

  beforeAll(async () => {
    app = createApp();

    const loginResponse = await request(app).post("/signin").send({
      email: "testuser3@example.com",
      password: "Password123",
    });

    accessToken = loginResponse.body.access_token;

    const [historyResponse] = await dbPool.execute(
      "INSERT INTO predictions (prediction, confidence, description, solution, user_id, plant_name, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        "Late Blight",
        77.04,
        "Late blight is a serious disease...",
        "Use resistant varieties and avoid overhead irrigation...",
        "asyfn5c6",
        "potato",
        "https://example.com/test-image.jpg",
      ]
    );

    testHistoryId = historyResponse.insertId;
  });

  afterAll(async () => {
    await dbPool.execute("DELETE FROM predictions WHERE id_pred = ?", [
      testHistoryId,
    ]);
    await dbPool.end();
  });

  describe("GET /history/:id", () => {
    it("should return history details for a valid history ID", async () => {
      const response = await request(app)
        .get(`/history/users/${testHistoryId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      console.log(response.body); // Debugging line

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.dataHistoryById[0].id_pred).toBe(testHistoryId);
    });

    it("should return 404 if history ID does not exist", async () => {
      const response = await request(app)
        .get(`/history/users/99999`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe("failed");
      expect(response.body.message).toBe("History not found");
    });
  });

  describe("GET /history", () => {
    it("should return all histories", async () => {
      const response = await request(app)
        .get(`/history`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(Array.isArray(response.body.dataHistory)).toBe(true);
    });
  });

  describe("GET /history/:user_id", () => {
    it("should return history for a valid user_id", async () => {
      const response = await request(app)
        .get(`/history/asyfn5c6`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(Array.isArray(response.body.dataHistoryUser)).toBe(true);
    });

    it("should return 404 if no history found for user_id", async () => {
      const response = await request(app)
        .get(`/history/unknown_user`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe("failed");
      expect(response.body.message).toBe("No history found for this user");
    });
  });

  describe("DELETE /history/users/:id_pred", () => {
    it("should delete history for a valid id_pred", async () => {
      const response = await request(app)
        .delete(`/history/users/${testHistoryId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("History deleted successfully");
    });

    it("should return 404 if history not found or no delete performed", async () => {
      const response = await request(app)
        .delete(`/history/users/99999`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe("failed");
      expect(response.body.message).toBe(
        "History not found or no delete performed"
      );
    });
  });
});
