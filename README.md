
# **Dokumentasi API Aplikasi Pendeteksi Penyakit Tanaman**

## **Fitur Autentikasi**

### **1. Registrasi Pengguna Baru**
- **Endpoint:** `/signup`
- **Metode:** `POST`
- **Deskripsi:** Mendaftarkan pengguna baru dengan data nama, email, dan password.
- **Format Request:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "name": "Test",
            "email": "test1@gmail.com",
            "password": "Baguskeren77"
        }
        ```
- **Response Berhasil:**
    - **Status Code:** 201 Created
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "User created successfully",
            "data": {
                "name": "Test",
                "email": "test1@gmail.com"
            }
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "Deskripsi kesalahan atau pesan error"
        }
        ```

---
### **2. Login Pengguna (Mendapatkan Access Token)**
- **Endpoint:** `/signin`
- **Metode:** `POST`
- **Deskripsi:** Melakukan login dengan email dan password untuk mendapatkan access token.
- **Format Request:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "email": "test1@gmail.com",
            "password": "Baguskeren77"
        }
        ```
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "user_id": "nqKeaO1vLxHM",
            "name": "Test",
            "email": "test1@gmail.com",
            "access_token": "your_access_token", 
            "message": "Login success"
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "error.message"
        }
        ```

---

### **3. Logout Pengguna (Menghapus Sesi Autentikasi)**
- **Endpoint:** `/signout`
- **Metode:** `POST`
- **Deskripsi:** Menghapus sesi autentikasi pengguna dengan Bearer Token di header.
- **Format Request:**
    - **Content-Type:** `application/json`
    - **Headers:** `Authorization: Bearer <token>`
    - **Body:**
        ```json
        {}
        ```
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "Signout success",
            "data": null
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "error.message"
        }
        ```

---

## **Fitur Manajemen Pengguna**

### **4. Mendapatkan Daftar Pengguna**
- **Endpoint:** `/users`
- **Metode:** `GET`
- **Deskripsi:** Mengambil daftar semua pengguna yang terdaftar dalam sistem.
- **Format Request:**
    - **Content-Type:** `application/json`
    - **Headers:** `Authorization: Bearer <token>`
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "Users found",
            "data": []
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "error.message"
        }
        ```

---

### **5. Mendapatkan Informasi Pengguna Berdasarkan ID**
- **Endpoint:** `/users/:user_id`
- **Metode:** `GET`
- **Deskripsi:** Mengambil data pengguna berdasarkan `user_id`.
- **Format Request:**
    - **Content-Type:** `application/json`
    - **Headers:** `Authorization: Bearer <token>`
    - **Parameter:** `user_id`
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "User found",
            "data": {
                "user_id": "nqKeaO1vLxHM",
                "name": "Test",
                "email": "test1@gmail.com",
                "role": "user",
                "created_at": "2025-04-27T03:37:00.000Z",
                "updated_at": "2025-04-27T03:37:00.000Z"
            }
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "error.message"
        }
        ```

---

### **6. Memperbarui Informasi Pengguna**
- **Endpoint:** `/users/update-users/:user_id`
- **Metode:** `PUT`
- **Deskripsi:** Memperbarui informasi pengguna, seperti nama, email, dan foto profil.
- **Format Request:**
    - **Content-Type:** `multipart/form-data`
    - **Headers:** `Authorization: Bearer <token>`
    - **Parameter:** `user_id`
    - **Body:**
        ```json
        {
            "name": "TestNew",
            "email": "test1@gmail.com",
            "photoProfileUrl": "http://example.com"
        }
        ```
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "User updated successfully",
            "dataUpdate": {
                "user_id": "nqKeaO1vLxHM",
                "name": "TestNew",
                "email": "test1@gmail.com",
                "photoProfileUrl": "http://example.com"
            }
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "error.message"
        }
        ```
### **7. Mengubah Password Pengguna**
- **Endpoint:** `/users/change-password/:user_id`
- **Metode:** `PUT`
- **Deskripsi:** Mengubah password pengguna. Pengguna harus menyertakan password lama (oldPassword), password baru (newPassword), dan konfirmasi password baru (confirmPassword).
- **Format Request:**
    - **Content-Type:** `application/json`
    - **Headers:** `Authorization: Bearer <token>`
    - **Parameter:** `user_id`
    - **Body:**
        ```json
        {
            "oldPassword": "TestingNew123",
            "newPassword": "TestingNew234",
            "confirmPassword": "TestingNew234"
        }
        ```
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "Password updated successfully"
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "Deskripsi kesalahan atau pesan error"
        }
        ```

---

## **Fitur Prediksi Penyakit Tanaman**

### **8. Prediksi Penyakit Tanaman**
- **Endpoint:** `/predict/<plant_name>`
- **Metode:** `POST`
- **Deskripsi:** Memprediksi penyakit pada tanaman berdasarkan gambar yang diunggah. Hanya menerima nama tanaman tertentu.
- **Parameter:** `plant_name` (corn, cassava, rice, potato)
- **Format Request:**
    - **Content-Type:** `multipart/form-data`
    - **Headers:** `Authorization: Bearer <token>`
    - **Body:** `file` (JPG/PNG)
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "confidence": 100.0,
            "description": "Common Rust is caused by Puccinia sorghi and appears as raised, brick-red pustules on leaves, reducing photosynthesis.",
            "image_url": "https://example.com/test_image.jpg",
            "plant_name": "corn",
            "prediction": "Corn Common Rust",
            "solution": "Use resistant varieties, apply fungicides early, and maintain proper plant spacing."
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "error.message"
        }
        ```

---

### **Fitur History**

### **9. Mendapatkan Semua Riwayat**
- **Endpoint:** `/history`
- **Metode:** `GET`
- **Deskripsi:** Mengambil daftar semua data riwayat prediksi penyakit tanaman.
- **Format Request:**
    - **Content-Type:** `application/json`
    - **Headers:** `Authorization: Bearer <token>`
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "History found",
            "dataHistory": []
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "Deskripsi kesalahan atau pesan error"
        }
        ```

---

### **10. Mendapatkan Riwayat Berdasarkan ID**
- **Endpoint:** `/history/:id_pred`
- **Metode:** `GET`
- **Deskripsi:** Mengambil data riwayat berdasarkan `id_pred`. Hanya satu data yang akan ditampilkan sesuai ID tersebut.
- **Format Request:**
    - **Content-Type:** `application/json`
    - **Headers:** `Authorization: Bearer <token>`
    - **Parameter:** `id_pred`
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "History found",
            "dataHistoryById": [
                {
                    "id_pred": 3422,
                    "prediction": "Corn Common Rust",
                    "confidence": 100,
                    "description": "Common Rust is caused by Puccinia sorghi and appears as raised, brick-red pustules on leaves, reducing photosynthesis.",
                    "solution": "Use resistant varieties, apply fungicides early, and maintain proper plant spacing.",
                    "user_id": "bm7kf1vf"
                }
            ]
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "Deskripsi kesalahan atau pesan error"
        }
        ```

---

### **11. Mendapatkan Riwayat Berdasarkan User ID**
- **Endpoint:** `/history/users/:user_id`
- **Metode:** `GET`
- **Deskripsi:** Mengambil semua data riwayat yang dibuat oleh pengguna tertentu berdasarkan `user_id`.
- **Format Request:**
    - **Content-Type:** `application/json`
    - **Headers:** `Authorization: Bearer <token>`
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "History found",
            "dataHistoryUser": []
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "Deskripsi kesalahan atau pesan error"
        }
        ```

---

### **12. Menghapus Data Riwayat Berdasarkan ID Prediksi**
- **Endpoint:** `/history/:id_pred`
- **Metode:** `DELETE`
- **Deskripsi:** Menghapus data riwayat berdasarkan `id_pred`. Setelah data dihapus, respons hanya mengembalikan pesan konfirmasi tanpa data tambahan.
- **Format Request:**
    - **Content-Type:** `application/json`
    - **Headers:** `Authorization: Bearer <token>`
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "History deleted successfully",
            "dataDelete": {
                "id_pred": "3422"
            }
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "Deskripsi kesalahan atau pesan error"
        }
        ```

---

### **Fitur Sharing**

### **13. Menambahkan Postingan Baru dengan Teks dan Gambar**
- **Endpoint:** `/sharing`
- **Metode:** `POST`
- **Deskripsi:** Membuat postingan baru dengan teks dan gambar dalam format JPG/PNG.
- **Format Request:**
    - **Content-Type:** `multipart/form-data`
    - **Headers:** `Authorization: Bearer <token>`
    - **Body:**
        ```json
        {
            "content": "Testing a response sharing",
            "imgUrl": "file (JPG/PNG)"
        }
        ```
- **Response Berhasil:**
    - **Status Code:** 201 Created
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "Content shared successfully",
            "dataPost": {
                "sharing_id": "sharing-cGzG",
                "name": "test",
                "content": "Testing a response sharing",
                "imgUrl": "https://imageexample.com"
            }
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "Deskripsi kesalahan atau pesan error"
        }
        ```

---

### **14. Mendapatkan Semua Daftar Sharing yang Telah Diposting**
- **Endpoint:** `/sharing`
- **Metode:** `GET`
- **Deskripsi:** Mengambil daftar seluruh postingan sharing yang telah dibuat, dengan opsi paginasi.
- **Format Request:**
    - **Content-Type:** `application/json`
    - **Headers:** `Authorization: Bearer <token>`
    - **Parameter:** `page`, `size`
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "Sharing content found",
            "dataGetAll": [
                {
                    "sharing_id": "sharing-cGzG",
                    "name": "test",
                    "content": "Testing a response sharing",
                    "imgUrl": "https://imageexample.com"
                }
            ],
            "pagination": {
                "totalItems": 1,
                "totalPages": 1,
                "currentPage": 1,
                "itemsPerPage": 10
            }
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "Deskripsi kesalahan atau pesan error"
        }
        ```

---

### **15. Mendapatkan Informasi Sharing Berdasarkan ID**
- **Endpoint:** `/sharing/:sharing_id`
- **Metode:** `GET`
- **Deskripsi:** Mengambil detail sebuah postingan berdasarkan `sharing_id`.
- **Format Request:**
    - **Content-Type:** `application/json`
    - **Headers:** `Authorization: Bearer <token>`
    - **Parameter:** `sharing_id`
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "Sharing found",
            "dataGetById": {
                "sharing_id": "sharing-cGzG",
                "name": "test",
                "content": "Testing a response sharing",
                "imgUrl": "https://imageexample.com"
            }
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "Deskripsi kesalahan atau pesan error"
        }
        ```

---

### **16. Mendapatkan Daftar Sharing yang Dibuat oleh Pengguna Tertentu**
- **Endpoint:** `/sharing/users/:user_id`
- **Metode:** `GET`
- **Deskripsi:** Mengambil daftar postingan sharing yang dibuat oleh pengguna tertentu berdasarkan `user_id`.
- **Format Request:**
    - **Content-Type:** `application/json`
    - **Headers:** `Authorization: Bearer <token>`
    - **Parameter:** `user_id`
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "Sharing content found",
            "dataGetByUser": [
                {
                    "sharing_id": "sharing-cGzG",
                    "name": "test",
                    "content": "Testing a response sharing",
                    "imgUrl": "https://imageexample.com"
                }
            ]
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "Deskripsi kesalahan atau pesan error"
        }
        ```

---

### **17. Memperbarui Postingan Sharing yang Telah Dibuat oleh Pengguna**
- **Endpoint:** `/sharing/:sharing_id`
- **Metode:** `PUT`
- **Deskripsi:** Memperbarui isi dari sebuah postingan berdasarkan `sharing_id`. Pengguna dapat mengubah teks dan/atau gambar. Jika `imgUrl` bernilai `null`, maka gambar tidak diperbarui.
- **Format Request:**
    - **Content-Type:** `multipart/form-data`
    - **Headers:** `Authorization: Bearer <token>`
    - **Parameter:** `sharing_id`
    - **Body:**
        ```json
        {
            "content": "Testing response update",
            "imgUrl": null
        }
        ```
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "Sharing updated successfully",
            "dataUpdate": {
                "sharing_id": "sharing-t0eU",
                "content": "Testing response update",
                "imgUrl": null
            }
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "Deskripsi kesalahan atau pesan error"
        }
        ```

---

### **18. Menghapus Postingan Sharing Berdasarkan ID**
- **Endpoint:** `/sharing/:sharing_id`
- **Metode:** `DELETE`
- **Deskripsi:** Menghapus sebuah postingan berdasarkan `sharing_id`.
- **Format Request:**
    - **Content-Type:** `application/json`
    - **Headers:** `Authorization: Bearer <token>`
    - **Parameter:** `sharing_id`
- **Response Berhasil:**
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "Sharing deleted successfully"
        }
        ```
- **Response Error:**
    - **Status Code:** 400 Bad Request
    - **Body:**
        ```json
        {
            "status": "failed",
            "message": "Deskripsi kesalahan atau pesan error"
        }
        ```
