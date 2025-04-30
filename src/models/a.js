import dbPool from "../config/connection";

const getPicture = async (email) => {
  const SQLQuery = `SELECT img_url FROM predictions WHERE email = ?`;
  const [rows] = await dbPool.execute(SQLQuery, [email]);
  if (rows.length > 0) {
    return rows[0];
  } else {
    return false;
  }
};

export default getPicture;
