import {
  postSharingModel,
  getAllSharingModel,
  getTotalSharingCount,
  getSharingByIdModel,
  getSharingByUserIdModel,
} from "../models/sharingModel.js";
import { uploadSharingImageToSpaces } from "../middleware/upload.js";
import jwt from "jsonwebtoken";

const postSharing = async (req, res) => {
  const { body } = req;
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Harap autentikasi terlebih dahulu" });
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  const name = decoded.name;
  const sharing_id = "sharing" + Math.random().toString(36).substring(2, 10);
  try {
    let imgUrl = null;
    if (req.file) {
      imgUrl = await uploadSharingImageToSpaces(req.file);
    }

    await postSharingModel(sharing_id, body.content, userId, name, imgUrl);

    res.status(201).json({
      status: "success",
      message: "Content shared successfully",
      dataPost: {
        sharing_id,
        name,
        content: body.content,
        imgUrl: imgUrl || null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
      dataPost: null,
    });
  }
};

const getAllSharing = async (req, res) => {
  try {
    let { page, size } = req.query;
    page = page ? parseInt(page) : 1;
    size = size ? parseInt(size) : 10;

    const offset = (page - 1) * size;
    const rows = await getAllSharingModel(offset, size);
    const totalItems = await getTotalSharingCount(); // Assuming you have a function to get the total count
    const totalPages = Math.ceil(totalItems / size);

    res.status(200).json({
      status: "success",
      message: "Sharing content found",
      data: rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: size,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
      data: null,
    });
  }
};

const getSharingById = async (req, res) => {
  const { sharing_id } = req.params;

  try {
    const sharing = await getSharingByIdModel(sharing_id);

    if (!sharing) {
      return res.status(404).json({ message: "Sharing not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Sharing found",
      data: sharing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
      data: null,
    });
  }
};

const getSharingByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    const rows = await getSharingByUserIdModel(user_id);
    if (!rows || rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No sharing found for this user" });
    }

    res.status(200).json({
      status: "success",
      message: "Sharing found",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
      data: null,
    });
  }
};

export { postSharing, getAllSharing, getSharingById, getSharingByUserId };
