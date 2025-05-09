import { getSharingByIdModel } from "../models/sharingModel.js";

const verifyOwnership = async (req, res, next) => {
  const { sharing_id } = req.params;

  if (!sharing_id) {
    return res
      .status(400)
      .json({ message: "Bad Request: sharing_id is required" });
  }

  try {
    const sharing = await getSharingByIdModel(sharing_id);
    if (!sharing) {
      return res.status(404).json({ message: "Sharing not found" });
    }

    if (sharing.user_id !== req.userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this sharing" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default verifyOwnership;
