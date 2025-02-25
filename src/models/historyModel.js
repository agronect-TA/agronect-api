import dbPool from "../config/connection.js";

// get history
const getAllHistoryModel = async () => {
  const [rows] = await dbPool.execute(
    "SELECT id_pred, prediction, confidence, description, solution, user_id, plant_name, image_url,image FROM predictions ORDER BY created_at DESC"
  );
  return rows.map((row) => ({
    ...row,
    image: row.image ? Buffer.from(row.image).toString("base64") : null,
  }));
};

const getHistoryByIdModel = async (id_pred) => {
  const [rows] = await dbPool.execute(
    "SELECT id_pred, prediction, confidence, description, solution, user_id FROM predictions WHERE id_pred = ? ORDER BY created_at DESC",
    [id_pred]
  );
  return rows;
};

const getAllHistoryByUserIdModel = async (user_id) => {
  const [rows] = await dbPool.execute(
    "SELECT id_pred, prediction, confidence, description, solution, user_id,plant_name,image_url,image FROM predictions WHERE user_id = ? ORDER BY created_at DESC",
    [user_id]
  );
  return rows;
};

const deleteHistoryModel = async (id_pred) => {
  const [result] = await dbPool.execute(
    "DELETE FROM predictions WHERE id_pred = ?",
    [id_pred]
  );
  return result;
};

export {
  getHistoryByIdModel,
  getAllHistoryModel,
  deleteHistoryModel,
  getAllHistoryByUserIdModel,
};
