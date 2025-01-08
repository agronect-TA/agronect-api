import bcrypt from "bcrypt";
import db from "../config/connection.js"; // Contoh konfigurasi database Anda

// Fungsi sign in
export async function signIn(email, password) {
  // Cari user berdasarkan email
  const user = await db.user.findOne({ where: { email } });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Verifikasi password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Return data user (tanpa password)
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

// Fungsi sign up
export async function signUp(data) {
  const { name, email, password } = data;

  // Periksa apakah email sudah ada
  const existingUser = await db.user.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan user baru ke database
  const newUser = await db.user.create({
    name,
    email,
    password: hashedPassword,
  });

  // Return data user (tanpa password)
  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  };
}
