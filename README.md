
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
    - **Status Code:** 200 OK
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

---

## **Fitur Prediksi Penyakit Tanaman**

### **7. Prediksi Penyakit Tanaman**
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

## **Fitur Berbagi Konten**

### **8. Menambahkan Postingan Baru**
- **Endpoint:** `/sharing`
- **Metode:** `POST`
- **Deskripsi:** Membuat postingan baru dengan teks dan gambar.
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
    - **Status Code:** 200 OK
    - **Body:**
        ```json
        {
            "status": "success",
            "message": "Content shared successfully",
            "dataPost": {
                "sharing_id": "sharing-cGzG",
                "name": "test",
                "content": "Testing a response sharing",
                "imgUrl": "https://example.com/image.jpg"
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

### **9. Mendapatkan Daftar Postingan**
- **Endpoint:** `/sharing`
- **Metode:** `GET`
- **Deskripsi:** Mengambil daftar seluruh postingan yang telah dibuat, dengan opsi paginasi.
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
            "dataGetAll": [],
            "pagination": {
                "totalItems": 0,
                "totalPages": 0,
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
            "message": "error.message"
        }
        ```

---

Dokumentasi ini memberikan gambaran yang jelas dan terstruktur tentang bagaimana mengakses dan menggunakan API. Setiap fitur disertai dengan contoh request dan response untuk mempermudah implementasi.
