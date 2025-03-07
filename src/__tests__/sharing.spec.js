import {
  getSharingById,
  getSharingByUserId,
  updateSharing,
  deleteSharing,
} from "../controllers/sharingController.js";
import {
  getSharingByIdModel,
  getSharingByUserIdModel,
  updateSharingModel,
  deleteSharingModel,
} from "../models/sharingModel.js";
import {
  deleteFileFromSpaces,
  uploadSharingImageToSpaces,
} from "../middleware/upload.js";

jest.mock("../models/sharingModel.js");
jest.mock("../middleware/upload.js");

describe("Sharing Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, file: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("getSharingById - should return sharing details", async () => {
    const mockSharing = { sharing_id: "123", content: "Test content" };
    getSharingByIdModel.mockResolvedValue(mockSharing);
    req.params.sharing_id = "123";

    await getSharingById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Sharing found",
      data: mockSharing,
    });
  });

  test("getSharingById - should return 404 if not found", async () => {
    getSharingByIdModel.mockResolvedValue(null);
    req.params.sharing_id = "999";

    await getSharingById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Sharing not found" });
  });

  test("getSharingByUserId - should return sharing list for a user", async () => {
    const mockSharingList = [{ sharing_id: "123", content: "Test post" }];
    getSharingByUserIdModel.mockResolvedValue(mockSharingList);
    req.params.user_id = "user123";

    await getSharingByUserId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Sharing found",
      data: mockSharingList,
    });
  });

  test("updateSharing - should update and return updated sharing", async () => {
    const mockSharing = {
      sharing_id: "123",
      content: "Old content",
      imgUrl: "old.jpg",
    };
    getSharingByIdModel.mockResolvedValue(mockSharing);
    updateSharingModel.mockResolvedValue({ affectedRows: 1 });
    deleteFileFromSpaces.mockResolvedValue();
    uploadSharingImageToSpaces.mockResolvedValue("new.jpg");
    req.params.sharing_id = "123";
    req.body.content = "Updated content";
    req.file = { buffer: "fakeBuffer" };

    await updateSharing(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Sharing updated successfully",
      dataUpdate: {
        sharing_id: "123",
        content: "Updated content",
        imgUrl: "new.jpg",
      },
    });
  });

  test("deleteSharing - should delete sharing successfully", async () => {
    const mockSharing = { sharing_id: "123", imgUrl: "old.jpg" };
    getSharingByIdModel.mockResolvedValue(mockSharing);
    deleteSharingModel.mockResolvedValue({ affectedRows: 1 });
    deleteFileFromSpaces.mockResolvedValue();
    req.params.sharing_id = "123";

    await deleteSharing(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Sharing deleted successfully",
      dataDelete: { sharing_id: "123" },
    });
  });

  test("deleteSharing - should return 404 if sharing not found", async () => {
    getSharingByIdModel.mockResolvedValue(null);
    req.params.sharing_id = "999";

    await deleteSharing(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "failed",
      message: "Sharing not found",
      dataDelete: null,
    });
  });
});
