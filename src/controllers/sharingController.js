import {
  postSharingModel,
  getAllSharingModel,
  getTotalSharingCount,
  getSharingByIdModel,
  getSharingByUserIdModel,
  deleteSharingModel,
  updateSharingModel,
} from "../models/sharingModel.js";
import {
  deleteFileFromSpaces,
  uploadSharingImageToSpaces,
} from "../middleware/upload.js";

const postSharing = async (req, res) => {
  try {
    const { body, userId, name } = req; // userId dan name dari middleware auth
    const sharing_id = "sharing-" + Math.random().toString(36).substring(2, 10);

    let imgUrl = req.file ? await uploadSharingImageToSpaces(req.file) : null;

    await postSharingModel(sharing_id, body.content, userId, name, imgUrl);

    res.status(201).json({
      status: "success",
      message: "Content shared successfully",
      dataPost: { sharing_id, name, content: body.content, imgUrl },
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

const updateSharing = async (req, res) => {
  const { sharing_id } = req.params;
  const { content, imgUrl } = req.body;
  try {
    // Fetch the current sharing record
    const existingSharing = await getSharingByIdModel(sharing_id);
    if (!existingSharing) {
      return res.status(404).json({
        status: "failed",
        message: "Sharing not found",
        dataUpdate: null,
      });
    }

    let updatedImgUrl = existingSharing.imgUrl;

    // Hanya hapus jika imgUrl secara eksplisit dikirim sebagai null
    if (imgUrl === null) {
      if (updatedImgUrl) {
        await deleteFileFromSpaces(updatedImgUrl);
        updatedImgUrl = null;
      }
    } else if (req.file) {
      // Jika ada file baru, hapus gambar lama lalu upload gambar baru
      if (updatedImgUrl) {
        await deleteFileFromSpaces(updatedImgUrl);
      }
      updatedImgUrl = await uploadSharingImageToSpaces(req.file);
    }

    const result = await updateSharingModel(sharing_id, content, updatedImgUrl);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "failed",
        message: "Sharing not found or no update performed",
        dataUpdate: null,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Sharing updated successfully",
      dataUpdate: {
        sharing_id,
        content,
        imgUrl: updatedImgUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
      dataUpdate: null,
    });
  }
};

const deleteSharing = async (req, res) => {
  const { sharing_id } = req.params;
  try {
    // Fetch the current sharing record
    const existingSharing = await getSharingByIdModel(sharing_id);
    if (!existingSharing) {
      return res.status(404).json({
        status: "failed",
        message: "Sharing not found",
        dataDelete: null,
      });
    }

    // Delete the image from GCS if it exists
    if (existingSharing.imgUrl) {
      await deleteFileFromSpaces(existingSharing.imgUrl);
    }

    const result = await deleteSharingModel(sharing_id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "failed",
        message: "Sharing not found or no delete performed",
        dataDelete: null,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Sharing deleted successfully",
      dataDelete: {
        sharing_id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
      dataDelete: null,
    });
  }
};

export {
  postSharing,
  getAllSharing,
  getSharingById,
  getSharingByUserId,
  updateSharing,
  deleteSharing,
};
