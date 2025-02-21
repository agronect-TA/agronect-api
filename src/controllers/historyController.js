import {
  getAllHistoryModel,
  getHistoryByIdModel,
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
  const { id } = req.params;

  try {
    const history = await getHistoryByIdModel(id);
    if (!history) {
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

export { getHistoryById, getAllHistorys };
