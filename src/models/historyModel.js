import dbPool from "../config/connection.js";

// get history
const getAllHistoryModel = async () => {
  const [rows] = await dbPool.execute(
    "SELECT id_pred, prediction, confidence, description, solution, user_id, plant_name, image FROM predictions ORDER BY created_at DESC"
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

export { getHistoryByIdModel, getAllHistoryModel };
