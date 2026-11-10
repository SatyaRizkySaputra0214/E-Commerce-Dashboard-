# Product Requirements Document (PRD)

# E-Commerce Administration Dashboard

------------------------------------------------------------------------

## 1. Project Overview

### 1.1 Latar Belakang

Aplikasi e-commerce membutuhkan sistem administrasi untuk membantu
pengelola memantau produk, mengelola informasi pesanan, dan melihat
ringkasan aktivitas penjualan. Untuk memenuhi kebutuhan tersebut,
dikembangkan **E-Commerce Administration Dashboard**, yaitu aplikasi
berbasis web yang menyediakan pengelolaan produk, pemantauan pesanan,
dan ringkasan data dalam satu sistem.

Aplikasi memiliki dua jenis pengguna, yaitu **Admin** dan **Staff**,
dengan hak akses berbeda. Admin dapat mengelola produk dan memperbarui
status pesanan, sedangkan Staff hanya dapat melihat data. Seluruh data
disimpan secara permanen di database, sementara autentikasi dan
pemeriksaan hak akses dilakukan di sisi server.

### 1.2 Tujuan Produk

1.  Menyediakan dashboard untuk memantau ringkasan produk dan pesanan.
2.  Mempermudah Admin mengelola data produk.
3.  Mempermudah Admin dan Staff memantau pesanan serta detail transaksi.
4.  Menerapkan autentikasi email dan password.
5.  Menerapkan Role-Based Access Control (RBAC) untuk membedakan hak
    akses.
6.  Menyediakan antarmuka responsif untuk desktop dan perangkat mobile.
7.  Menyediakan aplikasi yang dapat diakses secara online melalui
    Vercel.

### 1.3 Target Pengguna

  -----------------------------------------------------------------------
  Pengguna                            Deskripsi
  ----------------------------------- -----------------------------------
  Admin                               Dapat melihat dashboard, produk,
                                      dan pesanan; membuat, mengubah,
                                      serta menghapus produk; dan
                                      memperbarui status pesanan.

  Staff                               Dapat melihat dashboard, produk,
                                      dan pesanan, tetapi tidak dapat
                                      mengubah data.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 2. Scope of Project

### 2.1 In Scope

Fitur yang termasuk dalam pengembangan:

-   Login dan logout.
-   Autentikasi email dan password.
-   Pengelolaan sesi pengguna.
-   Pembatasan akses berdasarkan role Admin dan Staff.
-   Dashboard ringkasan data.
-   Product Management (CRUD).
-   Pencarian produk berdasarkan nama.
-   Filter produk berdasarkan kategori.
-   Daftar pesanan dan filter berdasarkan status.
-   Detail pesanan.
-   Pembaruan status pesanan oleh Admin.
-   Database persisten dan seed data.
-   Responsive design.
-   Loading indicator, empty state, validasi, dan notifikasi.
-   Deployment ke Vercel.
-   Dokumentasi melalui README.

### 2.2 Out of Scope

Fitur berikut tidak termasuk dalam assessment dan tidak perlu menjadi
prioritas:

-   Storefront atau halaman toko online.
-   Registrasi pengguna.
-   Manajemen atau pendaftaran pengguna baru.
-   Keranjang belanja dan checkout.
-   Integrasi payment gateway.
-   Upload gambar produk.
-   Pembuatan pesanan melalui antarmuka.
-   Pengiriman dan pelacakan barang.
-   Grafik analisis penjualan tingkat lanjut.
-   Integrasi layanan pihak ketiga yang tidak diperlukan.

**Batasan utama:** Aplikasi berfokus pada administrasi, bukan membangun
platform e-commerce lengkap. Prioritaskan fitur yang diwajibkan sebelum
menambahkan fitur lain.

------------------------------------------------------------------------

## 3. Technology Requirements

  Komponen            Teknologi / Ketentuan
  ------------------- ----------------------------------------------
  Framework           Nuxt
  Frontend            Nuxt / Vue
  Backend             Nuxt Server Routes
  Database            Postgree
  ORM                 Bebas, opsional
  Authentication      Email dan password
  Password security   Password hashing
  Authorization       Role-Based Access Control
  Styling             Bebas, misalnya Tailwind CSS atau UI library
  Deployment          Vercel
  Source code         Public GitHub repository

### 3.1 Arsitektur Aplikasi

Frontend dan backend berada dalam satu proyek Nuxt. Frontend bertugas
menampilkan antarmuka dan mengirim request, sedangkan Nuxt Server Routes
menangani autentikasi, validasi, pemeriksaan role, dan komunikasi dengan
database.

``` mermaid
flowchart TD
    A[User: Admin / Staff] --> B[Nuxt Frontend]
    B --> C[Nuxt Server Routes]
    C --> D[Authentication & RBAC]
    D --> E[(Persistent Database)]
    E --> C
    C --> B
    B --> F[Dashboard / Products / Orders]
```

Alur umum:

1.  Pengguna mengakses aplikasi melalui browser.
2.  Nuxt menampilkan halaman sesuai status autentikasi dan role.
3.  Frontend mengirim request ke Nuxt Server Routes ketika pengguna
    melakukan tindakan.
4.  Server memeriksa sesi dan hak akses pengguna.
5.  Jika diizinkan, server menjalankan proses yang diminta.
6.  Data dibaca atau diperbarui melalui database.
7.  Server mengembalikan hasil kepada frontend.

**Prinsip keamanan:** Validasi dan pemeriksaan hak akses wajib dilakukan
di backend. Menyembunyikan tombol di frontend saja tidak cukup.

------------------------------------------------------------------------

## 4. Functional Requirements

### 4.1 Authentication & Authorization

#### 4.1.1 Login

Sistem menyediakan halaman login agar pengguna dapat masuk menggunakan
akun yang telah disediakan.

**Input:** - Email. - Password.

**Alur proses:**

1.  Pengguna memasukkan email dan password.
2.  Sistem mencari akun berdasarkan email.
3.  Sistem membandingkan password yang dimasukkan dengan password hash
    di database.
4.  Jika valid, sistem membuat sesi autentikasi.
5.  Pengguna diarahkan ke Dashboard.
6.  Jika tidak valid, sistem menampilkan pesan kesalahan.

**Ketentuan:**

-   Password harus disimpan dalam bentuk hash, bukan plaintext.
-   Sesi tetap aktif setelah halaman di-refresh selama sesi masih
    berlaku.
-   Pengguna yang belum login tidak dapat mengakses halaman internal.
-   Pesan kesalahan tidak boleh membocorkan apakah email atau password
    yang salah.

#### 4.1.2 Logout

1.  Pengguna memilih tombol Logout.
2.  Sistem mengakhiri atau menghapus sesi autentikasi.
3.  Pengguna diarahkan ke halaman Login.
4.  Pengguna tidak dapat mengakses halaman terlindungi tanpa login
    kembali.

#### 4.1.3 Role-Based Access Control (RBAC)

  Fitur                           Admin   Staff
  ------------------------------ ------- -------
  Login dan logout                 Ya      Ya
  Melihat Dashboard                Ya      Ya
  Melihat Products                 Ya      Ya
  Mencari dan memfilter produk     Ya      Ya
  Membuat produk                   Ya     Tidak
  Mengedit produk                  Ya     Tidak
  Menghapus produk                 Ya     Tidak
  Melihat Orders                   Ya      Ya
  Memfilter pesanan                Ya      Ya
  Melihat detail pesanan           Ya      Ya
  Mengubah status pesanan          Ya     Tidak

**Ketentuan keamanan:**

-   Admin dapat mengakses seluruh fitur.
-   Staff hanya dapat mengakses fitur melihat data.
-   Tombol tindakan yang tidak diizinkan tidak ditampilkan kepada Staff.
-   Backend wajib memeriksa role pada setiap request yang membutuhkan
    izin khusus.
-   Request Staff untuk membuat, mengubah, atau menghapus produk harus
    ditolak dengan HTTP `403 Forbidden`.
-   Request Staff untuk mengubah status pesanan harus ditolak dengan
    HTTP `403 Forbidden`.
-   Request tanpa autentikasi ke endpoint terlindungi harus ditolak
    dengan HTTP `401 Unauthorized`.

### 4.2 Dashboard

Dashboard merupakan halaman utama setelah pengguna berhasil login.
Halaman ini menampilkan ringkasan data produk dan pesanan yang bersumber
dari database.

#### 4.2.1 Summary Cards

Dashboard wajib menampilkan empat informasi berikut:

  -----------------------------------------------------------------------
  Informasi                           Ketentuan
  ----------------------------------- -----------------------------------
  Total Products                      Jumlah seluruh produk aktif yang
                                      tercatat di database.

  Total Orders                        Jumlah seluruh pesanan, termasuk
                                      semua status.

  Completed Order Value               Total nilai pesanan yang berstatus
                                      `completed`.

  Low Stock Products                  Jumlah produk dengan stok kurang
                                      dari 5, yaitu stok 0--4.
  -----------------------------------------------------------------------

**Aturan perhitungan:**

1.  Total Products dihitung dari jumlah produk yang tidak dihapus atau
    tidak diarsipkan.
2.  Total Orders menghitung seluruh pesanan di database.
3.  Completed Order Value menjumlahkan nilai pesanan yang statusnya
    `completed` saja.
4.  Low Stock Products menghitung produk dengan nilai stok di bawah 5.

Seluruh nilai harus dihitung dari database, bukan angka statis atau
hardcoded.

#### 4.2.2 Recent Orders

Dashboard menampilkan lima pesanan terbaru berdasarkan tanggal pesanan.

Informasi yang ditampilkan:

-   Order Number.
-   Customer Name.
-   Order Date.
-   Total Amount.
-   Status.

Pengguna dapat membuka detail pesanan dengan memilih salah satu pesanan.

### 4.3 Product Management

Modul ini digunakan untuk melihat dan mengelola data produk.

#### 4.3.1 Product List

Sistem menampilkan daftar produk dalam tabel atau layout responsif.

  Field          Keterangan
  -------------- -------------------------------------------
  Product Name   Nama produk
  Category       Kategori produk
  Price          Harga produk dalam IDR
  Stock          Jumlah stok tersedia
  Actions        Tindakan pengelolaan produk, khusus Admin

#### 4.3.2 Search Product

Pengguna dapat mencari produk berdasarkan nama.

Ketentuan:

-   Pencarian dilakukan berdasarkan nama produk.
-   Pencarian tidak membedakan huruf besar dan kecil.
-   Hasil diperbarui sesuai kata kunci.
-   Jika tidak ada hasil, sistem menampilkan empty state.
-   Pencarian dapat digunakan bersamaan dengan filter kategori.

#### 4.3.3 Filter Category

Pengguna dapat menyaring produk berdasarkan kategori.

Ketentuan:

-   Kategori berasal dari data produk.
-   Pengguna dapat memilih satu kategori.
-   Sistem menampilkan produk sesuai kategori yang dipilih.
-   Tersedia pilihan `All Categories` untuk menampilkan seluruh produk.

#### 4.3.4 Create Product

**Hak akses: Admin saja.**

Admin dapat menambahkan produk baru melalui formulir.

  Field          Tipe            Validasi
  -------------- --------------- ------------------------------
  Product Name   Text            Wajib diisi
  Category       Text / Select   Wajib diisi
  Price          Number          Harus lebih dari 0
  Stock          Integer         Bilangan bulat dan minimal 0

**Alur proses:**

1.  Admin membuka halaman Products.
2.  Admin memilih tombol Add Product.
3.  Sistem menampilkan formulir.
4.  Admin mengisi informasi produk.
5.  Sistem memvalidasi input.
6.  Jika valid, data disimpan ke database.
7.  Sistem menampilkan notifikasi berhasil.
8.  Daftar produk diperbarui.

#### 4.3.5 Edit Product

**Hak akses: Admin saja.**

Ketentuan:

-   Formulir menampilkan data produk sebelumnya.
-   Admin dapat mengubah nama, kategori, harga, dan stok.
-   Sistem memvalidasi data sebelum menyimpan perubahan.
-   Perubahan disimpan ke database.
-   Sistem menampilkan notifikasi berhasil atau gagal.

#### 4.3.6 Delete Product

**Hak akses: Admin saja.**

Sebelum penghapusan, sistem harus meminta konfirmasi kepada Admin.

Contoh pesan:

> Are you sure you want to delete this product? This action cannot be
> undone.

Ketentuan:

-   Jika Admin memilih Cancel, penghapusan dibatalkan.
-   Jika Admin memilih Delete, produk dihapus atau dinonaktifkan.
-   Penghapusan produk tidak boleh menyebabkan detail pesanan lama
    hilang.
-   Sistem menampilkan notifikasi setelah proses berhasil atau gagal.

**Rekomendasi implementasi:** Gunakan soft delete atau mekanisme arsip
produk. Order Items juga perlu menyimpan snapshot nama produk dan harga
saat transaksi dibuat agar riwayat transaksi tetap konsisten meskipun
data produk berubah atau dihapus.

### 4.4 Order Management

Modul ini digunakan untuk melihat dan memantau seluruh pesanan
pelanggan.

#### 4.4.1 Order List

Sistem menampilkan seluruh pesanan yang tersimpan di database.

  Field           Keterangan
  --------------- -----------------------------------
  Order Number    Nomor unik pesanan
  Customer Name   Nama pelanggan
  Order Date      Tanggal pesanan
  Total           Total nilai pesanan
  Status          Status pesanan
  Actions         Aksi untuk melihat detail pesanan

#### 4.4.2 Order Status

Sistem mendukung empat status pesanan:

  Status         Deskripsi
  -------------- -----------------------------------------
  `pending`      Pesanan baru dibuat dan belum diproses.
  `processing`   Pesanan sedang diproses.
  `completed`    Pesanan telah selesai.
  `cancelled`    Pesanan dibatalkan.

#### 4.4.3 Filter Order

Pengguna dapat memfilter daftar pesanan berdasarkan status.

Pilihan filter:

-   All Status.
-   Pending.
-   Processing.
-   Completed.
-   Cancelled.

Hasil filter harus sesuai dengan status yang dipilih.

#### 4.4.4 Order Details

Pengguna dapat membuka detail pesanan untuk melihat informasi transaksi.

**Informasi pesanan:**

-   Order Number.
-   Customer Name.
-   Order Date.
-   Order Status.

**Daftar produk dalam pesanan:**

  Informasi      Keterangan
  -------------- -----------------------------
  Product Name   Nama produk
  Quantity       Jumlah produk yang dibeli
  Unit Price     Harga satuan saat transaksi
  Subtotal       Quantity × Unit Price

**Ringkasan transaksi:**

-   Total seluruh item.
-   Total nilai pesanan.

Perhitungan total harus konsisten dengan data transaksi di database.

#### 4.4.5 Update Order Status

**Hak akses: Admin saja.**

Alur proses:

1.  Admin membuka halaman Orders.
2.  Admin memilih pesanan.
3.  Admin membuka detail pesanan atau kontrol perubahan status.
4.  Admin memilih status baru.
5.  Frontend mengirim request ke backend.
6.  Backend memvalidasi sesi dan role Admin.
7.  Jika diizinkan, status diperbarui di database.
8.  Sistem menampilkan notifikasi berhasil atau gagal.

Ketentuan:

-   Status hanya boleh menggunakan empat nilai yang ditentukan.
-   Request perubahan status harus divalidasi di server.
-   Status terbaru tetap tersimpan setelah halaman di-refresh.
-   Perubahan status menjadi `completed` harus memengaruhi perhitungan
    Completed Order Value pada Dashboard.

Assessment tidak menetapkan aturan transisi status yang ketat. Karena
itu, Admin dapat memilih salah satu dari empat status selama nilai
status divalidasi di backend.

------------------------------------------------------------------------

## 5. Database Requirements

Database digunakan untuk menyimpan seluruh data aplikasi secara
permanen. Data tidak boleh hanya disimpan melalui localStorage,
sessionStorage, atau hardcoded array.

### 5.1 Database Entities

Disarankan menggunakan empat tabel utama:

1.  `users`
2.  `products`
3.  `orders`
4.  `order_items`

#### 5.1.1 Users

  Field        Tipe Data        Keterangan
  ------------ ---------------- ----------------------
  id           Integer / UUID   Primary Key
  name         String           Nama pengguna
  email        String           Email unik
  password     String           Password hash
  role         Enum / String    `admin` atau `staff`
  created_at   Timestamp        Waktu pembuatan

#### 5.1.2 Products

  -----------------------------------------------------------------------
  Field                   Tipe Data               Keterangan
  ----------------------- ----------------------- -----------------------
  id                      Integer / UUID          Primary Key

  name                    String                  Nama produk

  category                String                  Kategori produk

  price                   Decimal                 Harga produk

  stock                   Integer                 Jumlah stok

  created_at              Timestamp               Waktu pembuatan

  updated_at              Timestamp               Waktu perubahan

  deleted_at              Timestamp / Nullable    Waktu penghapusan jika
                                                  menggunakan soft delete
  -----------------------------------------------------------------------

#### 5.1.3 Orders

  Field           Tipe Data        Keterangan
  --------------- ---------------- --------------------
  id              Integer / UUID   Primary Key
  order_number    String           Nomor pesanan unik
  customer_name   String           Nama pelanggan
  order_date      Timestamp        Tanggal pesanan
  total           Decimal          Total pesanan
  status          Enum / String    Status pesanan
  created_at      Timestamp        Waktu pembuatan
  updated_at      Timestamp        Waktu perubahan

#### 5.1.4 Order Items

  Field          Tipe Data                Keterangan
  -------------- ------------------------ -----------------------------
  id             Integer / UUID           Primary Key
  order_id       Foreign Key              Relasi ke Orders
  product_id     Foreign Key / Nullable   Relasi ke Products
  product_name   String                   Snapshot nama produk
  quantity       Integer                  Jumlah produk
  unit_price     Decimal                  Harga produk saat transaksi
  subtotal       Decimal                  Quantity × Unit Price

**Mengapa Order Items diperlukan?**

Satu pesanan dapat berisi lebih dari satu produk. Karena itu, data
pesanan dan daftar produk yang dibeli harus dipisahkan. Satu order dapat
memiliki banyak order items.

Snapshot nama dan harga produk diperlukan agar riwayat transaksi tidak
berubah ketika nama atau harga produk diperbarui. Jika produk dihapus
secara permanen, `product_id` dapat dibuat nullable, sedangkan snapshot
nama dan harga tetap disimpan.

### 5.2 Entity Relationship Diagram (ERD)

``` mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email UK
        string password
        string role
    }

    PRODUCTS {
        int id PK
        string name
        string category
        decimal price
        int stock
        timestamp deleted_at
    }

    ORDERS {
        int id PK
        string order_number UK
        string customer_name
        timestamp order_date
        decimal total
        string status
    }

    ORDER_ITEMS {
        int id PK
        int order_id FK
        int product_id FK
        string product_name
        int quantity
        decimal unit_price
        decimal subtotal
    }

    ORDERS ||--|{ ORDER_ITEMS : contains
    PRODUCTS o|--o{ ORDER_ITEMS : referenced_by
```

Catatan relasi:

-   Satu order wajib memiliki minimal satu order item.
-   Satu produk dapat muncul di banyak order item.
-   Produk dapat diarsipkan tanpa menghilangkan riwayat transaksi.
-   `product_id` pada Order Items dapat bernilai NULL jika produk
    dihapus permanen, tetapi snapshot nama dan harga harus tetap
    tersedia.

### 5.3 Seed Data

Sistem harus menyediakan script untuk mengisi data awal database.

  Data                                        Minimum
  -------------------- ------------------------------
  Admin                                             1
  Staff                                             1
  Products                                         10
  Product Categories                                3
  Low-stock Products                                2
  Orders                                            8
  Order Items            Minimal 1 untuk setiap order

Seluruh empat status pesanan harus terwakili dalam seed data.

### 5.4 Demo Accounts

  Role    Email                 Password
  ------- --------------------- -----------------
  Admin   `admin@example.com`   `AdminDemo123!`
  Staff   `staff@example.com`   `StaffDemo123!`

Ketentuan:

-   Kedua akun harus dapat digunakan untuk login.
-   Password wajib di-hash sebelum disimpan.
-   Akun demo dibuat melalui seed script.
-   Password plaintext tidak boleh disimpan di database atau
    dikembalikan melalui API.

------------------------------------------------------------------------

### 5.5 Tempat penyimpanan Database (Neon)
Gunakan dan masukkan ke .env
# Postgres — your database connection
DATABASE_URL="postgresql://neondb_owner:npg_9WFQXvRBDH7Z@ep-frosty-forest-aoesyfp2.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

DATABASE_URL_POOLED="postgresql://neondb_owner:npg_9WFQXvRBDH7Z@ep-frosty-forest-aoesyfp2-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"


## 6. User Interface Requirements

### 6.1 General Layout

Aplikasi menggunakan dashboard layout yang konsisten.

Elemen utama:

1.  Sidebar navigation.
2.  Header atau top navigation.
3.  Main content.
4.  Informasi pengguna dan role.
5.  Logout button.

Navigasi utama:

-   Dashboard.
-   Products.
-   Orders.
-   Logout.

Admin dan Staff dapat melihat menu Dashboard, Products, dan Orders.
Namun, kontrol untuk mengubah data hanya tersedia bagi Admin.

### 6.2 Responsive Design

**Desktop:**

-   Sidebar dapat ditampilkan secara permanen.
-   Tabel menggunakan ruang layar yang tersedia.
-   Formulir dan informasi ditampilkan dengan layout yang nyaman.

**Mobile:**

-   Sidebar dapat diubah menjadi drawer atau menu navigasi.
-   Tabel dapat menggunakan horizontal scrolling atau tampilan card.
-   Formulir menyesuaikan lebar layar.
-   Tombol dan input mudah digunakan melalui sentuhan.
-   Tidak ada elemen penting yang terpotong.

### 6.3 UI States

Setiap halaman harus menangani kondisi berikut:

  -----------------------------------------------------------------------
  State                               Perilaku
  ----------------------------------- -----------------------------------
  Loading                             Menampilkan indikator ketika data
                                      sedang dimuat.

  Empty                               Menampilkan informasi jika belum
                                      ada data atau hasil pencarian.

  Error                               Menampilkan pesan ketika terjadi
                                      kegagalan.

  Success                             Menampilkan notifikasi setelah
                                      tindakan berhasil.

  Validation                          Menampilkan pesan ketika input
                                      tidak sesuai aturan.
  -----------------------------------------------------------------------

Contoh pesan:

-   Empty: `No products found. Try changing your search or filter.`
-   Success: `Product successfully created.`
-   Error: `Failed to update order status. Please try again.`

------------------------------------------------------------------------

## 7. API Requirements

Seluruh backend menggunakan Nuxt Server Routes.

### 7.1 Authentication API

  --------------------------------------------------------------------------
  Method            Endpoint             Fungsi            Akses
  ----------------- -------------------- ----------------- -----------------
  POST              `/api/auth/login`    Login pengguna    Public

  POST              `/api/auth/logout`   Logout pengguna   Authenticated

  GET               `/api/auth/me`       Mengambil         Authenticated
                                         informasi         
                                         pengguna aktif    
  --------------------------------------------------------------------------

### 7.2 Dashboard API

  --------------------------------------------------------------------------------------
  Method            Endpoint                         Fungsi            Akses
  ----------------- -------------------------------- ----------------- -----------------
  GET               `/api/dashboard/summary`         Mengambil         Authenticated
                                                     ringkasan         
                                                     dashboard         

  GET               `/api/dashboard/recent-orders`   Mengambil lima    Authenticated
                                                     pesanan terbaru   
  --------------------------------------------------------------------------------------

### 7.3 Products API

  Method   Endpoint              Fungsi                    Akses
  -------- --------------------- ------------------------- ---------------
  GET      `/api/products`       Mengambil daftar produk   Authenticated
  GET      `/api/products/:id`   Mengambil detail produk   Authenticated
  POST     `/api/products`       Membuat produk            Admin
  PUT      `/api/products/:id`   Memperbarui produk        Admin
  DELETE   `/api/products/:id`   Menghapus produk          Admin

Endpoint daftar produk dapat menerima query parameter:

-   `search`: mencari nama produk.
-   `category`: menyaring kategori.

Contoh: `/api/products?search=keyboard&category=Electronics`

### 7.4 Orders API

  --------------------------------------------------------------------------------
  Method            Endpoint                   Fungsi            Akses
  ----------------- -------------------------- ----------------- -----------------
  GET               `/api/orders`              Mengambil daftar  Authenticated
                                               pesanan           

  GET               `/api/orders/:id`          Mengambil detail  Authenticated
                                               pesanan           

  PATCH             `/api/orders/:id/status`   Memperbarui       Admin
                                               status pesanan    
  --------------------------------------------------------------------------------

Endpoint daftar pesanan dapat menerima parameter `status`.

Contoh: `/api/orders?status=completed`

### 7.5 API Response Standard

Gunakan format response yang konsisten.

Contoh berhasil:

``` json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "name": "Wireless Keyboard",
    "category": "Electronics",
    "price": 250000,
    "stock": 10
  }
}
```

Contoh gagal:

``` json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "price": "Price must be greater than zero"
  }
}
```

HTTP status code yang disarankan:

  Code   Keterangan
  ------ ----------------------
  200    Request berhasil
  201    Data berhasil dibuat
  400    Request tidak valid
  401    Belum login
  403    Tidak memiliki izin
  404    Data tidak ditemukan
  422    Validasi input gagal
  500    Kesalahan server

------------------------------------------------------------------------

## 8. Security Requirements

### 8.1 Password Security

-   Password harus di-hash menggunakan algoritma yang sesuai, seperti
    Argon2id atau bcrypt.
-   Password tidak boleh disimpan sebagai plaintext.
-   Password tidak boleh dikembalikan melalui API.

### 8.2 Session Management

-   Gunakan session atau mekanisme autentikasi yang aman.
-   Session harus tetap valid setelah halaman di-refresh.
-   Cookie autentikasi sebaiknya menggunakan `HttpOnly`, `Secure` pada
    HTTPS, dan `SameSite` yang sesuai.
-   Logout harus mengakhiri sesi di server.
-   Sesi harus memiliki masa berlaku.

### 8.3 Authorization

-   Role harus diperiksa di server.
-   Jangan hanya mengandalkan conditional rendering di frontend.
-   Semua endpoint yang membutuhkan autentikasi wajib memeriksa sesi.
-   Endpoint khusus Admin harus menolak request dari Staff.

### 8.4 Input Validation

Semua data yang diterima backend harus divalidasi.

-   Nama produk tidak boleh kosong.
-   Harga harus berupa angka positif.
-   Stok harus berupa bilangan bulat dan tidak boleh negatif.
-   Status pesanan hanya menerima empat nilai yang diperbolehkan.
-   ID produk dan pesanan harus valid.
-   Data yang digunakan dalam query harus ditangani dengan aman untuk
    mencegah SQL injection.

### 8.5 Environment Variables

Informasi sensitif harus disimpan melalui environment variables.

Contoh `.env.example`:

``` env
DATABASE_URL=
SESSION_SECRET=
```

Ketentuan:

-   Jangan memasukkan credential database ke GitHub.
-   Jangan memasukkan secret asli ke `.env.example`.
-   File `.env` harus masuk ke `.gitignore`.
-   Environment variables production harus dikonfigurasi di Vercel.

------------------------------------------------------------------------

## 9. Non-Functional Requirements

  -----------------------------------------------------------------------
  Aspek                               Requirement
  ----------------------------------- -----------------------------------
  Performance                         Halaman dan data dimuat dalam waktu
                                      yang wajar.

  Reliability                         Data tersimpan secara permanen di
                                      database.

  Security                            Password di-hash dan akses
                                      diperiksa di server.

  Responsiveness                      Aplikasi dapat digunakan di desktop
                                      dan mobile.

  Maintainability                     Kode memiliki struktur yang jelas
                                      dan mudah dipahami.

  Usability                           Navigasi, formulir, dan informasi
                                      mudah digunakan.

  Consistency                         Format tanggal, mata uang, dan
                                      status konsisten.

  Deployment                          Aplikasi dapat diakses melalui
                                      Vercel.
  -----------------------------------------------------------------------

### 9.1 Currency & Date Format

-   Mata uang menggunakan Rupiah (IDR).
-   Format harga mengikuti standar Indonesia, misalnya `Rp250.000`.
-   Tanggal ditampilkan dalam format yang mudah dipahami.
-   Zona waktu tampilan menggunakan WIB (UTC+7).

### 9.2 Data Integrity

-   Nomor pesanan harus unik.
-   Email pengguna harus unik.
-   Setiap pesanan wajib memiliki minimal satu item.
-   Harga dan total transaksi harus konsisten.
-   Penghapusan produk tidak boleh merusak riwayat transaksi.

------------------------------------------------------------------------

## 10. User Flow

### 10.1 Authentication Flow

``` mermaid
flowchart TD
    A[Open Application] --> B{Already Logged In?}
    B -->|No| C[Login Page]
    C --> D[Enter Email & Password]
    D --> E{Credentials Valid?}
    E -->|No| F[Show Error]
    F --> D
    E -->|Yes| G[Create Session]
    B -->|Yes| H[Dashboard]
    G --> H
    H --> I[Access Application]
    I --> J[Logout]
    J --> K[End Session]
    K --> C
```

### 10.2 Admin Flow

``` mermaid
flowchart TD
    A[Admin Login] --> B[Dashboard]
    B --> C{Select Menu}
    C -->|Dashboard| D[View Summary & Recent Orders]
    C -->|Products| E[Product Management]
    C -->|Orders| F[Order Management]
    E --> G[Create / Edit / Delete Product]
    F --> H[View Order Details]
    H --> I[Update Order Status]
    D --> J[Logout]
    G --> J
    I --> J
```

### 10.3 Staff Flow

``` mermaid
flowchart TD
    A[Staff Login] --> B[Dashboard]
    B --> C{Select Menu}
    C -->|Dashboard| D[View Summary]
    C -->|Products| E[View / Search / Filter Products]
    C -->|Orders| F[View / Filter Orders]
    F --> G[View Order Details]
    D --> H[Logout]
    E --> H
    G --> H
```

------------------------------------------------------------------------

## 11. Acceptance Criteria

Fitur dinyatakan memenuhi kebutuhan apabila kriteria berikut berhasil
diuji.

  ------------------------------------------------------------------------
                           No. Modul                 Acceptance Criteria
  ---------------------------- --------------------- ---------------------
                             1 Login                 Admin dan Staff dapat
                                                     login menggunakan
                                                     akun demo.

                             2 Login                 Password disimpan
                                                     dalam bentuk hash.

                             3 Session               Pengguna tetap login
                                                     setelah refresh
                                                     selama sesi valid.

                             4 Logout                Sesi pengguna
                                                     berakhir setelah
                                                     logout.

                             5 Protection            Pengguna tanpa login
                                                     tidak dapat membuka
                                                     halaman internal.

                             6 RBAC                  Staff tidak dapat
                                                     melakukan CRUD produk
                                                     melalui backend.

                             7 RBAC                  Staff tidak dapat
                                                     mengubah status
                                                     pesanan melalui
                                                     backend.

                             8 Dashboard             Empat ringkasan
                                                     berasal dari
                                                     database.

                             9 Dashboard             Lima pesanan terbaru
                                                     ditampilkan.

                            10 Products              Daftar produk
                                                     menampilkan nama,
                                                     kategori, harga, dan
                                                     stok.

                            11 Products              Pencarian berdasarkan
                                                     nama berfungsi.

                            12 Products              Filter kategori
                                                     berfungsi.

                            13 Products              Admin dapat
                                                     menambahkan produk.

                            14 Products              Admin dapat mengedit
                                                     produk.

                            15 Products              Admin dapat menghapus
                                                     produk dengan
                                                     konfirmasi.

                            16 Products              Penghapusan tidak
                                                     merusak riwayat
                                                     transaksi.

                            17 Products              Validasi harga dan
                                                     stok berfungsi.

                            18 Orders                Daftar pesanan
                                                     menampilkan informasi
                                                     yang diperlukan.

                            19 Orders                Filter berdasarkan
                                                     status berfungsi.

                            20 Orders                Detail pesanan
                                                     menampilkan item,
                                                     quantity, harga, dan
                                                     subtotal.

                            21 Orders                Admin dapat mengubah
                                                     status pesanan.

                            22 Orders                Perubahan status
                                                     memengaruhi ringkasan
                                                     dashboard.

                            23 Database              Seed menghasilkan dua
                                                     akun, minimal 10
                                                     produk, dan minimal 8
                                                     pesanan.

                            24 Database              Seluruh empat status
                                                     pesanan tersedia
                                                     dalam seed.

                            25 UI                    Loading, empty,
                                                     error, success, dan
                                                     validation states
                                                     tersedia.

                            26 Responsive            Aplikasi dapat
                                                     digunakan di desktop
                                                     dan mobile.

                            27 Deployment            Aplikasi dapat
                                                     diakses melalui
                                                     Vercel.

                            28 GitHub                Source code tersedia
                                                     di public repository.

                            29 Documentation         README menjelaskan
                                                     setup, fitur, akun
                                                     demo, keamanan, dan
                                                     AI tools.
  ------------------------------------------------------------------------

------------------------------------------------------------------------

## 12. Testing Requirements

### 12.1 Authentication Testing

  Test Case                            Expected Result
  ------------------------------------ ------------------------------
  Login dengan akun Admin yang benar   Berhasil masuk sebagai Admin
  Login dengan akun Staff yang benar   Berhasil masuk sebagai Staff
  Login dengan password salah          Login ditolak
  Login dengan email tidak terdaftar   Login ditolak
  Refresh setelah login                Session tetap aktif
  Logout                               Session berakhir
  Akses Dashboard tanpa login          Dialihkan ke Login

### 12.2 Authorization Testing

  Test Case                             Expected Result
  ------------------------------------- -----------------------------
  Admin membuat produk                  Berhasil
  Staff membuat produk melalui UI       Aksi tidak tersedia
  Staff mengirim POST langsung ke API   HTTP 403
  Admin mengubah produk                 Berhasil
  Staff mengirim PUT langsung ke API    HTTP 403
  Admin menghapus produk                Berhasil setelah konfirmasi
  Staff menghapus produk melalui API    HTTP 403
  Admin mengubah status pesanan         Berhasil
  Staff mengubah status melalui API     HTTP 403

### 12.3 Product Testing

-   Menambahkan produk dengan data lengkap.
-   Menambahkan produk tanpa nama.
-   Memasukkan harga nol atau negatif.
-   Memasukkan stok negatif.
-   Memasukkan stok desimal.
-   Mencari produk berdasarkan nama.
-   Memfilter berdasarkan kategori.
-   Mengedit produk.
-   Menghapus produk yang belum memiliki transaksi.
-   Menghapus produk yang sudah memiliki riwayat transaksi.

### 12.4 Order Testing

-   Melihat daftar pesanan.
-   Memfilter setiap status.
-   Melihat detail pesanan.
-   Mengubah status menjadi Pending.
-   Mengubah status menjadi Processing.
-   Mengubah status menjadi Completed.
-   Mengubah status menjadi Cancelled.
-   Mengirim status yang tidak valid melalui API.
-   Memeriksa perubahan Completed Order Value setelah status diperbarui.

### 12.5 Deployment Testing

-   Memastikan aplikasi dapat dibuka melalui URL Vercel.
-   Memastikan koneksi database production berjalan.
-   Memastikan kedua akun demo dapat login.
-   Memastikan seluruh seed data tersedia.
-   Memastikan CRUD dan pembaruan status berfungsi di production.
-   Memastikan environment variables telah dikonfigurasi.
-   Memastikan tidak ada error kritis di browser dan server.

------------------------------------------------------------------------

## 13. Deployment & Documentation

### 13.1 Deployment

Aplikasi harus di-deploy ke Vercel sebelum deadline assessment.

Persyaratan:

1.  Repository GitHub bersifat public.
2.  Project Vercel terhubung dengan repository.
3.  Database production menggunakan layanan database persisten.
4.  Environment variables dikonfigurasi di Vercel.
5.  Database production sudah diinisialisasi.
6.  Seed data sudah dimasukkan.
7.  Akun Admin dan Staff dapat digunakan.
8.  Seluruh fitur utama berjalan di production.

**Catatan:** Jangan mengandalkan database SQLite lokal atau penyimpanan
file lokal yang tidak persisten untuk production. Gunakan database
hosted yang dapat diakses oleh aplikasi Vercel.

### 13.2 README Requirements

README harus menjelaskan:

1.  Project overview.
2.  Teknologi yang digunakan.
3.  Fitur aplikasi.
4.  Struktur folder.
5.  Persyaratan instalasi.
6.  Cara menjalankan project secara lokal.
7.  Environment variables.
8.  Cara melakukan migrasi database.
9.  Cara menjalankan seed.
10. Demo credentials.
11. Cara kerja autentikasi.
12. Cara kerja RBAC.
13. Known issues atau fitur yang belum selesai.
14. AI tools yang digunakan, jika ada.

### 13.3 Submission Requirements

Informasi yang dikirimkan melalui email:

-   Full Name.
-   Live Vercel URL.
-   Public GitHub Repository URL.
-   Admin Credentials.
-   Staff Credentials.
-   Brief Explanation of Implemented Features.
-   Known Issues or Incomplete Features.
-   AI Tools Used, if any.

------------------------------------------------------------------------

## 14. Development Priority & Timeline

Waktu pengerjaan assessment adalah 09.00--17.00 WIB. Pengembangan harus
mengutamakan fitur wajib dan memastikan aplikasi sudah dapat digunakan
sebelum deadline.

  -----------------------------------------------------------------------
  Waktu                   Tahapan                 Aktivitas
  ----------------------- ----------------------- -----------------------
  09.00--09.30            Project Setup           Setup Nuxt, struktur
                                                  folder, konfigurasi
                                                  database, dan instalasi
                                                  dependencies.

  09.30--11.00            Database &              Membuat schema, seed
                          Authentication          data, login, session,
                                                  logout, dan middleware
                                                  autentikasi.

  11.00--12.00            RBAC & Dashboard        Membuat pemeriksaan
                                                  role di server dan
                                                  ringkasan dashboard
                                                  berbasis database.

  12.00--13.30            Product Management      Membuat daftar produk,
                                                  search, filter, CRUD,
                                                  dan validasi.

  13.30--14.45            Order Management        Membuat daftar pesanan,
                                                  filter, detail pesanan,
                                                  dan pembaruan status.

  14.45--15.30            UI & Responsive         Menyempurnakan
                                                  navigasi, tabel,
                                                  formulir, loading,
                                                  empty state, dan
                                                  feedback.

  15.30--16.15            Testing & Bug Fixing    Menguji autentikasi,
                                                  izin akses, CRUD,
                                                  perhitungan dashboard,
                                                  dan fitur utama.

  16.15--16.45            Deployment              Deploy Vercel,
                                                  konfigurasi environment
                                                  variables, database
                                                  production, dan
                                                  verifikasi akun demo.

  16.45--17.00            Documentation &         Memperbarui README,
                          Submission              memastikan GitHub
                                                  public, dan mengirim
                                                  email submission.
  -----------------------------------------------------------------------

Jadwal ini merupakan estimasi. Jika deployment atau database mengalami
kendala, kurangi pekerjaan kosmetik UI, bukan pengujian keamanan dan
fungsionalitas.

------------------------------------------------------------------------

## 15. Risks & Mitigation

  -----------------------------------------------------------------------
  Risiko                  Dampak                  Solusi
  ----------------------- ----------------------- -----------------------
  Koneksi database        Aplikasi tidak dapat    Uji koneksi database
  production gagal        digunakan               sejak awal.

  Session tidak bertahan  Pengguna harus login    Gunakan session
  setelah refresh         berulang kali           berbasis cookie yang
                                                  persisten.

  RBAC hanya di frontend  Staff dapat             Validasi role pada
                          memanipulasi request    setiap endpoint server.

  Riwayat transaksi       Data order menjadi      Gunakan soft delete dan
  hilang setelah produk   tidak konsisten         snapshot data produk.
  dihapus                                         

  Perhitungan dashboard   Informasi penjualan     Hitung berdasarkan data
  tidak sesuai            salah                   dan status di database.

  Deployment terlalu lama Terlambat submit        Deploy lebih awal,
                                                  jangan menunggu semua
                                                  fitur selesai.

  Seed production tidak   Akun demo tidak dapat   Siapkan dan uji script
  berjalan                digunakan               seed sebelum
                                                  deployment.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 16. Definition of Done

Pengembangan dianggap selesai apabila seluruh kondisi berikut terpenuhi:

-   [ ] Aplikasi menggunakan Nuxt.
-   [ ] Backend menggunakan Nuxt Server Routes.
-   [ ] Database persisten telah terhubung.
-   [ ] Admin dan Staff dapat login.
-   [ ] Password tersimpan dalam bentuk hash.
-   [ ] Session tetap aktif setelah refresh.
-   [ ] Logout berfungsi.
-   [ ] RBAC diterapkan di backend.
-   [ ] Dashboard menampilkan empat ringkasan dari database.
-   [ ] Lima pesanan terbaru ditampilkan.
-   [ ] Product CRUD berfungsi untuk Admin.
-   [ ] Search dan filter produk berfungsi.
-   [ ] Order list dan filter status berfungsi.
-   [ ] Detail pesanan berfungsi.
-   [ ] Admin dapat memperbarui status pesanan.
-   [ ] Data seed memenuhi ketentuan minimum.
-   [ ] Interface responsif.
-   [ ] Loading, empty, error, dan success states tersedia.
-   [ ] README lengkap.
-   [ ] `.env.example` tersedia.
-   [ ] Tidak ada secret yang ter-commit.
-   [ ] GitHub repository bersifat public.
-   [ ] Deployment Vercel aktif dan fungsional.
-   [ ] Kedua akun demo dapat digunakan di production.

------------------------------------------------------------------------

## 17. Catatan Teknis dan Rekomendasi

### 17.1 Prisma Tidak Wajib Digunakan

Assessment secara eksplisit memberikan kebebasan dalam memilih ORM.
Prisma dapat digunakan untuk mempermudah pengelolaan schema dan query
database, tetapi bukan persyaratan wajib. Alternatifnya, dapat
menggunakan Drizzle ORM atau query SQL secara langsung.

### 17.2 Gunakan Session yang Persisten

Jangan hanya menyimpan informasi login di localStorage. Pastikan server
dapat memvalidasi session pengguna setiap kali mengakses endpoint
terlindungi. Session berbasis database merupakan pilihan yang baik untuk
kebutuhan ini.

### 17.3 Pertahankan Riwayat Transaksi

Ketika produk dihapus atau harganya berubah, detail transaksi lama tidak
boleh ikut berubah. Karena itu, Order Items perlu menyimpan snapshot
nama dan harga produk pada saat transaksi dibuat.

### 17.4 Pastikan Perhitungan Dashboard Benar

Completed Order Value hanya menjumlahkan pesanan berstatus `completed`.
Jangan menjumlahkan seluruh order karena akan menghasilkan angka yang
tidak sesuai ketentuan.

### 17.5 Prioritaskan Server-side Authorization

Menyembunyikan tombol Edit dan Delete dari Staff belum cukup. Penguji
dapat mengirim request langsung melalui browser developer tools atau API
client. Backend harus tetap menolak request tersebut.

### 17.6 Lakukan Deployment Lebih Awal

Lakukan deployment awal ketika authentication, database, dan struktur
aplikasi sudah tersedia. Dengan demikian, jika ada masalah konfigurasi
Vercel atau database production, masih tersedia waktu untuk
memperbaikinya.

------------------------------------------------------------------------

## 18. Kesimpulan Prioritas Pengembangan

Lima aspek utama yang harus dipastikan sebelum submission:

1.  **Authentication & RBAC:** Kedua akun dapat login dan Staff
    benar-benar tidak bisa melakukan tindakan khusus Admin.
2.  **Database:** Semua informasi tersimpan secara permanen dan seluruh
    seed data tersedia.
3.  **Core Features:** Dashboard, Product Management, dan Order
    Management berjalan dengan benar.
4.  **Deployment:** Aplikasi di Vercel benar-benar fungsional, bukan
    sekadar berhasil di-build.
5.  **Documentation & Explanation:** Pengembang memahami alur kode,
    struktur database, autentikasi, dan pemeriksaan hak akses.

Fokus utama assessment adalah aplikasi yang berfungsi, menggunakan
database nyata, menerapkan keamanan dengan benar, dan dapat dijelaskan
saat follow-up review. Tampilan yang menarik merupakan nilai tambah,
tetapi tidak boleh mengorbankan fungsionalitas, keamanan, dan kesiapan
deployment.
