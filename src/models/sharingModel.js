import dbPool from "../config/connection.js";

const postSharingModel = async (sharing_id, content, userId, name, imgUrl) => {
  const query = `
      INSERT INTO sharing (sharing_id, content, user_id, name, imgUrl)
      VALUES (?, ?, ?, ?, ?)
    `;
  const values = [sharing_id, content, userId, name, imgUrl];

  return dbPool.execute(query, values);
};

const getAllSharingModel = async (offset, limit) => {
  return dbPool.query(
    "SELECT * FROM sharing ORDER BY created_at DESC LIMIT ?, ?",
    [offset, limit]
  );
};

const getTotalSharingCount = async () => {
  const [rows] = await dbPool.query("SELECT COUNT(*) as count FROM sharing");
  return rows[0].count;
};

export { getAllSharingModel, getTotalSharingCount, postSharingModel };
