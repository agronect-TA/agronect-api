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
  const [rows] = await dbPool.query(
    "SELECT * FROM sharing ORDER BY created_at DESC LIMIT ?, ?",
    [offset, limit]
  );

  // Konversi Buffer ke String jika imgUrl masih Buffer
  rows.forEach((row) => {
    if (Buffer.isBuffer(row.imgUrl)) {
      row.imgUrl = row.imgUrl.toString("utf-8");
    }
  });

  return rows;
};

const getTotalSharingCount = async () => {
  const [rows] = await dbPool.query("SELECT COUNT(*) as count FROM sharing");
  return rows[0].count;
};

const getSharingByIdModel = async (sharing_id) => {
  const [rows] = await dbPool.execute(
    "SELECT * FROM sharing WHERE sharing_id = ?",
    [sharing_id]
  );
  return rows.length > 0 ? rows[0] : null;
};

const getSharingByUserIdModel = async (user_id) => {
  const [rows] = await dbPool.execute(
    "SELECT * FROM sharing WHERE user_id = ? ORDER BY created_at DESC",
    [user_id]
  );
  return rows;
};

const updateSharingModel = async (sharing_id, content, imgUrl) => {
  const query = `
        UPDATE sharing
        SET content = ?, imgUrl = ?
        WHERE sharing_id = ?
    `;
  const values = [content, imgUrl, sharing_id];

  const [result] = await dbPool.execute(query, values);
  return result;
};

const deleteSharingModel = async (sharing_id) => {
  const query = `
        DELETE FROM sharing
        WHERE sharing_id = ?
    `;

  const [result] = await dbPool.execute(query, [sharing_id]);
  return result;
};
export {
  getAllSharingModel,
  getTotalSharingCount,
  postSharingModel,
  getSharingByIdModel,
  getSharingByUserIdModel,
  updateSharingModel,
  deleteSharingModel,
};
