import request from "supertest";
import { createApp } from "../config/app.js"; // Sesuaikan dengan file utama Express Anda
import dbPool from "../config/connection.js";

import dotenv from "dotenv";
dotenv.config();

describe("User Management Integration Tests", () => {
  let app;
  let accessToken;
  let testUserId;

  beforeAll(async () => {
    app = createApp();

    // Buat akun dummy untuk pengujian
    await request(app).post("/signup").send({
      name: "Test User",
      email: "testuser2@example.com",
      password: "Password123",
    });

    const loginResponse = await request(app).post("/signin").send({
      email: "testuser2@example.com",
      password: "Password123",
    });

    accessToken = loginResponse.body.access_token;
    testUserId = loginResponse.body.user_id;
  });

  afterAll(async () => {
    await dbPool.execute("DELETE FROM user WHERE email = ?", [
      "testuser2@example.com",
    ]);
    await dbPool.end();
  });

  describe("GET /users/:id", () => {
    it("should return user details for a valid user ID", async () => {
      const response = await request(app)
        .get(`/users/${testUserId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.email).toBe("testuser2@example.com");
    });
  });
  describe("GET /users/:id (not found)", () => {
    it("should return 404 if user ID does not exist", async () => {
      const response = await request(app)
        .get(`/users/99999`) // ID yang tidak ada
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe("failed");
      expect(response.body.message).toBe("User not found");
    });
  });

  describe("GET /users/", () => {
    it("should return all users", async () => {
      const response = await request(app)
        .get(`/users/`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
  describe("PUT /users/update-users/:id (email validation)", () => {
    it("should return 400 if email is already used by another user", async () => {
      // Buat user baru untuk uji coba validasi email
      await request(app).post("/signup").send({
        name: "Another User",
        email: "anotheruser@example.com",
        password: "Password123",
      });

      const response = await request(app)
        .put(`/users/update-users/${testUserId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .field("name", "Updated User")
        .field("email", "anotheruser@example.com"); // Email user lain

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("failed");
      expect(response.body.message).toBe(
        "Email is already used by another user"
      );

      // Cleanup user baru
      await dbPool.execute("DELETE FROM user WHERE email = ?", [
        "anotheruser@example.com",
      ]);
    });
  });

  describe("PUT /users/change-password/:id", () => {
    it("should successfully update the password", async () => {
      const response = await request(app)
        .put(`/users/change-password/${testUserId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          oldPassword: "Password123",
          newPassword: "NewPassword123",
          confirmPassword: "NewPassword123",
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Password updated successfully");

      const loginResponse = await request(app).post("/signin").send({
        email: "testuser2@example.com",
        password: "NewPassword123",
      });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.status).toBe("success");
    });

    it("should fail if old password is incorrect", async () => {
      const response = await request(app)
        .put(`/users/change-password/${testUserId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          oldPassword: "WrongPassword123",
          newPassword: "AnotherPassword123",
          confirmPassword: "AnotherPassword123",
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("failed");
      expect(response.body.message).toBe("Old password is incorrect");
    });
  });
});
