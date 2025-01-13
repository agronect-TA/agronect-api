import {
  getUserById,
  getAllUsers,
  changePassword,
  updateUser,
} from "../controllers/usersController.js";

import {
  getUserByIdModel,
  getAllUsersModel,
  changePasswordModel,
  updateUserModel,
} from "../models/usersModel.js";

import bcrypt from "bcrypt";

jest.mock("../models/usersModel.js");
jest.mock("bcrypt");

describe("User Management API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserById", () => {
    it("should return user data if user exists", async () => {
      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      getUserByIdModel.mockResolvedValue([
        { user_id: 1, name: "John", password: "hashedPassword" },
      ]);

      await getUserById(req, res);

      expect(getUserByIdModel).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "User found",
        data: { user_id: 1, name: "John" },
      });
    });

    it("should return 404 if user does not exist", async () => {
      const req = { params: { id: "2" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      getUserByIdModel.mockResolvedValue([]);

      await getUserById(req, res);

      expect(getUserByIdModel).toHaveBeenCalledWith("2");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "failed",
        message: "User not found",
        data: null,
      });
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      getAllUsersModel.mockResolvedValue([{ user_id: 1, name: "John" }]);

      await getAllUsers(req, res);

      expect(getAllUsersModel).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Users found",
        data: [{ user_id: 1, name: "John" }],
      });
    });
  });

  describe("changePassword", () => {
    it("should change the user password if old password matches", async () => {
      const req = {
        params: { id: "1" },
        body: {
          oldPassword: "oldPass",
          newPassword: "newPass",
          confirmPassword: "newPass",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      getUserByIdModel.mockResolvedValue([
        { user_id: 1, password: "hashedOldPass" },
      ]);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue("hashedNewPass");
      changePasswordModel.mockResolvedValue({ affectedRows: 1 });

      await changePassword(req, res);

      expect(getUserByIdModel).toHaveBeenCalledWith("1");
      expect(bcrypt.compare).toHaveBeenCalledWith("oldPass", "hashedOldPass");
      expect(bcrypt.hash).toHaveBeenCalledWith("newPass", 10);
      expect(changePasswordModel).toHaveBeenCalledWith("1", "hashedNewPass");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Password updated successfully",
      });
    });
  });

  describe("updateUser", () => {
    it("should update user data and return the updated user", async () => {
      const req = {
        params: { id: "1" },
        body: { name: "New Name", email: "newemail@example.com" },
        file: null,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      getUserByIdModel.mockResolvedValue([
        { user_id: 1, photoProfileUrl: "oldPhotoUrl" },
      ]);
      updateUserModel.mockResolvedValue({ affectedRows: 1 });
      getUserByIdModel.mockResolvedValue([
        {
          user_id: 1,
          name: "New Name",
          email: "newemail@example.com",
          photoProfileUrl: "oldPhotoUrl",
        },
      ]);

      await updateUser(req, res);

      expect(getUserByIdModel).toHaveBeenCalledWith("1");
      expect(updateUserModel).toHaveBeenCalledWith("1", {
        name: "New Name",
        email: "newemail@example.com",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "User updated successfully",
        dataUpdate: {
          user_id: 1,
          name: "New Name",
          email: "newemail@example.com",
          photoProfileUrl: "oldPhotoUrl",
        },
      });
    });
  });
});
