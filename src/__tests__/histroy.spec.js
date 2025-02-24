import {
  getAllHistorys,
  getHistoryById,
} from "../controllers/historyController.js";
import {
  getAllHistoryModel,
  getHistoryByIdModel,
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
          description:
            "Late blight is a serious disease caused by Phytophthora infestans. It affects potato, tomato, and occasionally eggplant and other members of the potato family. The disease causes large, greasy-looking, greenish-black spots on leaves and stems, which can lead to rapid defoliation and death of the plant. Tubers can also be affected, causing them to rot.",
          solution:
            "To prevent late blight, use varieties resistant to the disease. Keep plants healthy and stressed plants are more predisposed to late blight. Avoid overhead irrigation and do not dig tubers until they are fully mature to prevent damage. Rotate crops and avoid planting potatoes or tomatoes in the same location for at least two years. Keep the field at least 225 to 450 yards away from last years field and surround the field with wheat to keep wind-blown spores from entering. Use adequate nitrogen levels and low phosphorus levels to reduce disease severity. Implement chemical control measures as recommended.",
          user_id: "asyfn5c6",
          plant_name: "potato",
          image_url:
            "https://agronect-spaces.sgp1.digitaloceanspaces.com/Image_Predict_Upload/asyfn5c6_1740398145.jpg",
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
        description:
          "Late blight is a serious disease caused by Phytophthora infestans. It affects potato, tomato, and occasionally eggplant and other members of the potato family. The disease causes large, greasy-looking, greenish-black spots on leaves and stems, which can lead to rapid defoliation and death of the plant. Tubers can also be affected, causing them to rot.",
        solution:
          "To prevent late blight, use varieties resistant to the disease. Keep plants healthy and stressed plants are more predisposed to late blight. Avoid overhead irrigation and do not dig tubers until they are fully mature to prevent damage. Rotate crops and avoid planting potatoes or tomatoes in the same location for at least two years. Keep the field at least 225 to 450 yards away from last years field and surround the field with wheat to keep wind-blown spores from entering. Use adequate nitrogen levels and low phosphorus levels to reduce disease severity. Implement chemical control measures as recommended.",
        user_id: "asyfn5c6",
        plant_name: "potato",
        image_url:
          "https://agronect-spaces.sgp1.digitaloceanspaces.com/Image_Predict_Upload/asyfn5c6_1740398145.jpg",
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
});
