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
