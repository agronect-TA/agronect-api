import {
  postSharing,
  getAllSharing,
} from "../controllers/sharingController.js";
import {
  postSharingModel,
  getAllSharingModel,
  getTotalSharingCount,
} from "../models/sharingModel.js";
import jwt from "jsonwebtoken";

jest.mock("../models/sharingModel.js");
jest.mock("jsonwebtoken");

describe("Sharing Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("postSharing - should return 401 if no token provided", async () => {
    const req = { headers: {}, body: { content: "Test content" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await postSharing(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Harap autentikasi terlebih dahulu",
    });
  });

  test("postSharing - should return 201 if post is successful", async () => {
    const token = "valid.token.here";
    jwt.verify.mockReturnValue({ id: "user1", name: "Test User" });
    postSharingModel.mockResolvedValue();

    const req = {
      headers: { authorization: `Bearer ${token}` },
      body: { content: "New post content" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await postSharing(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        message: "Content shared successfully",
      })
    );
  });

  test("postSharing - should return 500 if there is an error", async () => {
    const token = "valid.token.here";
    jwt.verify.mockReturnValue({ id: "user1", name: "Test User" });
    postSharingModel.mockRejectedValue(new Error("Database error"));

    const req = {
      headers: { authorization: `Bearer ${token}` },
      body: { content: "New post content" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await postSharing(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "failed",
        message: "Internal server error",
      })
    );
  });

  test("getAllSharing - should return paginated results", async () => {
    getAllSharingModel.mockResolvedValue([
      { sharing_id: "1", content: "Test" },
    ]);
    getTotalSharingCount.mockResolvedValue(1);

    const req = { query: { page: "1", size: "10" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getAllSharing(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        pagination: expect.any(Object),
      })
    );
  });
});
