import {
  getAllHistorys,
  getHistoryById,
  getHistoryByUserId,
  deleteHistory,
} from "../controllers/historyController.js";
import {
  getAllHistoryModel,
  getHistoryByIdModel,
  getAllHistoryByUserIdModel,
  deleteHistoryModel,
} from "../models/historyModel.js";

jest.mock("../models/historyModel.js");

let mockResponse;

beforeEach(() => {
  mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
});

describe("History Controller", () => {
  describe("getAllHistorys", () => {
    it("should return all history records", async () => {
      const mockRows = [
        {
          id_pred: 77,
          prediction: "Late Blight",
          confidence: 77.04793548583984,
          description: "Late blight is a serious disease...",
          solution: "Use resistant varieties and avoid overhead irrigation...",
          user_id: "asyfn5c6",
          plant_name: "potato",
          image_url: "https://example.com/image.jpg",
        },
      ];

      getAllHistoryModel.mockResolvedValue(mockRows);

      const mockRequest = {};
      await getAllHistorys(mockRequest, mockResponse);

      expect(getAllHistoryModel).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        message: "History found",
        dataHistory: mockRows,
      });
    });

    it("should return 404 if no history found", async () => {
      getAllHistoryModel.mockResolvedValue([]);

      const mockRequest = {};
      await getAllHistorys(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "failed",
        message: "No history found",
        dataHistory: null,
      });
    });
  });

  describe("getHistoryById", () => {
    it("should return history record by id", async () => {
      const mockHistory = {
        id_pred: 77,
        prediction: "Late Blight",
        confidence: 77.04793548583984,
        description: "Late blight is a serious disease...",
        solution: "Use resistant varieties and avoid overhead irrigation...",
        user_id: "asyfn5c6",
        plant_name: "potato",
        image_url: "https://example.com/image.jpg",
      };

      getHistoryByIdModel.mockResolvedValue([mockHistory]);

      const mockRequest = { params: { id_pred: 77 } };
      await getHistoryById(mockRequest, mockResponse);

      expect(getHistoryByIdModel).toHaveBeenCalledWith(77);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        message: "History found",
        dataHistoryById: [mockHistory],
      });
    });

    it("should return 404 if history not found", async () => {
      getHistoryByIdModel.mockResolvedValue([]);

      const mockRequest = { params: { id_pred: 99 } };
      await getHistoryById(mockRequest, mockResponse);

      expect(getHistoryByIdModel).toHaveBeenCalledWith(99);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "failed",
        message: "History not found",
        dataHistoryById: null,
      });
    });
  });

  describe("getHistoryByUserId", () => {
    it("should return history records for a valid user ID", async () => {
      const mockHistory = [
        {
          id_pred: 92,
          prediction: "Late Blight",
          confidence: 77.04,
          description: "Late blight is a serious disease...",
          solution: "Use resistant varieties and avoid overhead irrigation...",
          user_id: "asyfn5c6",
        },
      ];

      getAllHistoryByUserIdModel.mockResolvedValue(mockHistory);

      const mockRequest = { params: { user_id: "asyfn5c6" } };
      await getHistoryByUserId(mockRequest, mockResponse);

      expect(getAllHistoryByUserIdModel).toHaveBeenCalledWith("asyfn5c6");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        message: "History found",
        dataHistoryUser: mockHistory,
      });
    });

    it("should return 404 if no history found for user", async () => {
      getAllHistoryByUserIdModel.mockResolvedValue([]);

      const mockRequest = { params: { user_id: "unknownUser" } };
      await getHistoryByUserId(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "failed",
        message: "No history found for this user",
        dataHistoryUser: null,
      });
    });
  });

  describe("deleteHistory", () => {
    it("should delete history record if it exists", async () => {
      deleteHistoryModel.mockResolvedValue({ affectedRows: 1 });

      const mockRequest = { params: { id_pred: 92 } };
      await deleteHistory(mockRequest, mockResponse);

      expect(deleteHistoryModel).toHaveBeenCalledWith(92);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        message: "History deleted successfully",
        dataDelete: { id_pred: 92 },
      });
    });

    it("should return 404 if history record not found", async () => {
      deleteHistoryModel.mockResolvedValue({ affectedRows: 0 });

      const mockRequest = { params: { id_pred: 99999 } };
      await deleteHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "failed",
        message: "History not found or no delete performed",
        dataDelete: null,
      });
    });
  });
});
