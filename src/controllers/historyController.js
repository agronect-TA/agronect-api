import {
  getAllHistoryModel,
  getHistoryByIdModel,
  getAllHistoryByUserIdModel,
  deleteHistoryModel,
} from "../models/historyModel.js";

const getAllHistorys = async (req, res) => {
  try {
    const rows = await getAllHistoryModel();
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No history found",
        dataHistory: null,
      });
    }
    res.status(200).json({
      status: "success",
      message: "History found",
      dataHistory: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

const getHistoryById = async (req, res) => {
  const { id_pred } = req.params;

  try {
    const history = await getHistoryByIdModel(id_pred);
    if (!history || history.length === 0) {
      // Tambahkan pengecekan length
      return res.status(404).json({
        status: "failed",
        message: "History not found",
        dataHistoryById: null,
      });
    }
    res.status(200).json({
      status: "success",
      message: "History found",
      dataHistoryById: history,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
      dataHistoryById: null,
    });
  }
};

const getHistoryByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const rows = await getAllHistoryByUserIdModel(user_id);
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No history found for this user",
        dataHistoryUser: null,
      });
    }
    res.status(200).json({
      status: "success",
      message: "History found",
      dataHistoryUser: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
      dataHistoryUser: null,
    });
  }
};

const deleteHistory = async (req, res) => {
  const { id_pred } = req.params;
  try {
    const result = await deleteHistoryModel(id_pred);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "failed",
        message: "History not found or no delete performed",
        dataDelete: null,
      });
    }
    res.status(200).json({
      status: "success",
      message: "History deleted successfully",
      dataDelete: {
        id_pred,
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

export { getHistoryById, getAllHistorys, deleteHistory, getHistoryByUserId };
