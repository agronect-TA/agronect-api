import { signUp, signIn, signOut } from "../controllers/authenticationController";
import {
  checkedEmailRegister,
  signupAuthModel,
  signinAuthModel,
  signoutAuthModel,
} from "../models/authenticationModels";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../models/authenticationModels");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

let mockResponse;

beforeEach(() => {
  mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
});

describe("Authentication Controller", () => {
  describe("signUp", () => {
    it("should create a new user if email is not registered", async () => {
      checkedEmailRegister.mockResolvedValue(false);
      signupAuthModel.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue("hashedPassword");

      const mockRequest = {
        body: { name: "Test", email: "test@example.com", password: "password123" },
      };

      await signUp(mockRequest, mockResponse);

      expect(checkedEmailRegister).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(signupAuthModel).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        message: "User created successfully",
        data: { name: "Test", email: "test@example.com" },
      });
    });

    it("should return an error if email is already registered", async () => {
      checkedEmailRegister.mockResolvedValue(true);

      const mockRequest = {
        body: { email: "test@example.com" },
      };

      await signUp(mockRequest, mockResponse);

      expect(checkedEmailRegister).toHaveBeenCalledWith("test@example.com");
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "failed",
        message: "Email already registered",
        data: null,
      });
    });
  });

  describe("signIn", () => {
    it("should return a success response when credentials are valid", async () => {
      const mockUser = {
        user_id: "userId123",
        email: "test@example.com",
        password: "hashedPassword",
        name: "Test User",
        photoProfileUrl: "url",
      };

      signinAuthModel.mockResolvedValue([mockUser]);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fakeToken");

      const mockRequest = {
        body: { email: "test@example.com", password: "password123" },
      };

      await signIn(mockRequest, mockResponse);

      expect(signinAuthModel).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: "userId123",
          email: "test@example.com",
          name: "Test User",
          photoProfileUrl: "url",
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        user_id: "userId123",
        name: "Test User",
        email: "test@example.com",
        photoProfileUrl: "url",
        access_token: "fakeToken",
        message: "Login success",
      });
    });

    it("should return an error if email is not registered", async () => {
      signinAuthModel.mockResolvedValue([]);

      const mockRequest = {
        body: { email: "unknown@example.com" },
      };

      await signIn(mockRequest, mockResponse);

      expect(signinAuthModel).toHaveBeenCalledWith("unknown@example.com");
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "failed",
        message: "Email not registered",
        data: null,
      });
    });
  });

  describe("signOut", () => {
    it("should sign out successfully if token is provided", async () => {
      signoutAuthModel.mockResolvedValue(true);

      const mockRequest = {
        headers: { authorization: "Bearer fakeToken" },
      };

      await signOut(mockRequest, mockResponse);

      expect(signoutAuthModel).toHaveBeenCalledWith("fakeToken");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        message: "Signout success",
        data: null,
      });
    });

    it("should return an error if token is missing", async () => {
      const mockRequest = { headers: {} };

      await signOut(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "failed",
        message: "Token is expired or not found",
        data: null,
      });
    });
  });
});
