# Loka Store Admin

Dashboard internal untuk mengelola katalog produk dan memantau pesanan toko. Aplikasi memakai Nuxt 4 dan Vue 3 di sisi web, API Nitro di sisi server, PostgreSQL sebagai penyimpanan, serta Drizzle ORM untuk skema dan query.

## Prasyarat

- Node.js **24.14.0** (sesuai `engines` di `package.json`)
- Yarn **4.13.0** melalui Corepack
- PostgreSQL yang dapat diakses dari mesin pengembang. Contoh konfigurasi cocok untuk PostgreSQL/Neon dengan SSL.

## Menjalankan secara lokal

```bash
corepack enable
corepack prepare yarn@4.13.0 --activate
yarn install
Copy-Item .env.example .env
```

Isi `.env` dengan URL database dan secret sesi milik lingkungan lokal Anda, lalu buat tabel dan data demo:

```bash
yarn db:migrate
yarn db:seed
yarn dev
```

Buka alamat yang dicetak Nuxt di terminal (konfigurasi proyek menggunakan port `8080`). Perintah produksi lokal:

```bash
yarn build
yarn start
```

`yarn db:generate` membuat berkas migrasi dari perubahan pada `server/database/schema.ts`; tinjau migrasi tersebut sebelum menjalankan `yarn db:migrate`.

## Konfigurasi lingkungan

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `DATABASE_URL` | Ya | Connection string PostgreSQL langsung. Dipakai migrasi, seeding, dan aplikasi lokal. |
| `DATABASE_URL_POOLED` | Tidak | Tersedia sebagai contoh konfigurasi, tetapi koneksi runtime saat ini membaca `DATABASE_URL`; variabel ini belum dipakai otomatis. |
| `SESSION_SECRET` | Ya | Secret acak minimal 16 karakter untuk HMAC token sesi. Buat nilai baru per lingkungan. |
| `BASE_URL` | Tidak | Base path Nuxt bila aplikasi dipasang di subpath. Biarkan kosong untuk root. |

Buat secret lokal di terminal, lalu salin langsung ke `.env` (jangan masukkan nilainya ke dokumentasi atau commit):

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Salin hasilnya ke `SESSION_SECRET` di `.env`. Jangan commit `.env`, URL database, session secret, token, cookie, atau dump database. `.env.example` hanya berisi contoh format tanpa kredensial yang dapat dipakai.

## Data demo dan akun

`yarn db:seed` memasukkan dua akun demo, 12 produk, dan 10 pesanan beserta baris itemnya. Seed dapat dijalankan ulang: akun akan diperbarui, sementara tabel `order_items`, `orders`, dan `products` di-truncate lalu diisi ulang. **Gunakan hanya pada database lokal/demo**, karena pesanan dan produk yang sudah ada di database tersebut akan terhapus. Akun pengguna lain tidak dihapus.

| Peran | Email | Kata sandi |
| --- | --- | --- |
| Admin | `admin@example.com` | `AdminDemo123!` |
| Staff | `staff@example.com` | `StaffDemo123!` |

Akun di atas adalah kredensial publik untuk data seed, bukan akun produksi. Jangan gunakan ulang kata sandinya di layanan lain.

## Fitur dan alur penggunaan

- **Login dan logout** — masuk menggunakan email dan kata sandi; sesi bertahan selama tujuh hari atau sampai logout.
- **Dashboard** — ringkasan jumlah produk aktif, jumlah pesanan, nilai pesanan berstatus selesai, jumlah produk dengan stok kurang dari lima, dan lima pesanan terbaru.
- **Produk** — telusuri katalog, cari berdasarkan nama, filter kategori, dan berpindah halaman. Admin dapat menambah, mengubah, dan menghapus produk. Penghapusan produk bersifat soft delete sehingga produk tidak lagi tampil di katalog, sementara referensi pesanan lama tetap aman.
- **Pesanan** — cari berdasarkan nomor pesanan, nama atau email pelanggan; filter berdasarkan status; gunakan pagination untuk daftar panjang.
- **Detail pesanan** — buka pesanan dari tabel untuk melihat pelanggan, status, tanggal, total, dan rincian item.
- **Status pesanan** — admin dapat memperbarui status ke `pending`, `processing`, `completed`, atau `cancelled` dari halaman detail.
- **Feedback antarmuka** — form menampilkan validasi, notifikasi hasil aksi, dialog konfirmasi sebelum hapus, serta tampilan loading dan kondisi kosong.

## Autentikasi dan izin

Route middleware Nuxt (`app/middleware/auth.global.ts`) mengarahkan pengguna yang belum login ke `/login`, dan pengguna yang sudah login menjauhi halaman login. Ini untuk alur antarmuka; **pemeriksaan izin yang menentukan akses tetap dilakukan di API server**.

Saat login, server memverifikasi password hash, lalu membuat token acak. Browser menerima cookie `HttpOnly`, `SameSite=Lax`, path `/`, dengan masa berlaku tujuh hari (flag `Secure` aktif pada production). Database hanya menyimpan HMAC-SHA256 hash token di tabel `sessions`, bukan token browser. `SESSION_SECRET` digunakan untuk menghasilkan dan mencocokkan hash. Logout menghapus sesi server dan cookie. Endpoint yang memerlukan pengguna menjalankan `requireAuth`; pengguna tanpa sesi valid menerima HTTP 401. Endpoint tulis khusus admin menjalankan `requireAdmin`; staf yang telah login menerima HTTP 403.

| Aksi | Admin | Staff |
| --- | :---: | :---: |
| Melihat dashboard, daftar produk, daftar/detail pesanan | Ya | Ya |
| Membuat, mengubah, atau menghapus produk | Ya | Tidak |
| Mengubah status pesanan | Ya | Tidak |

Pemeriksaan role berada di handler API, bukan hanya menyembunyikan tombol di UI. Untuk meninjau implementasinya, lihat `server/utils/session.ts`, route terkait di `server/api/`, dan middleware UI di `app/middleware/`.

## Struktur database

Skema sumber ada di `server/database/schema.ts`; migrasi SQL tersimpan di `drizzle/`.

| Tabel | Isi dan relasi utama |
| --- | --- |
| `users` | Email unik, nama, password hash, role (`admin` atau `staff`), waktu pembuatan/perubahan. |
| `sessions` | Hash token unik, user pemilik sesi, waktu kedaluwarsa; sesi terhapus saat user dihapus. |
| `products` | Nama, kategori, harga, stok, timestamps, `deleted_at` untuk soft delete. Harga dan stok dibatasi tidak negatif. |
| `orders` | Nomor pesanan unik, data pelanggan, status, total, tanggal pesanan dan timestamps. |
| `order_items` | Snapshot nama dan harga produk, kuantitas, subtotal; terhubung ke pesanan (cascade) dan produk (set null jika produk dihapus permanen). |

Harga dan nilai uang disimpan sebagai `numeric(12,2)`. Produk dan pesanan mempunyai indeks untuk kolom pencarian/filter yang umum; item pesanan diindeks berdasarkan pesanan dan produk.

## Peta kode

- `app/pages/` — halaman dashboard, login, katalog produk, daftar dan detail pesanan.
- `app/components/` — tabel, form produk, navigasi, dialog, pagination, dan komponen status.
- `app/stores/` — state autentikasi dan notifikasi di Pinia.
- `server/api/` — endpoint HTTP untuk autentikasi, dashboard, produk, dan pesanan.
- `server/utils/` — koneksi DB, validasi, hashing password, sesi, dan transformasi data.
- `server/database/schema.ts`, `drizzle/` — definisi tabel dan migrasi PostgreSQL.
- `shared/types/` — tipe respons API, domain, dan autentikasi yang digunakan bersama.
- `scripts/seed.ts` — data akun, katalog, dan pesanan demo.

## Pemeriksaan kualitas

```bash
yarn lint
yarn type-check
yarn test
yarn build
```

Vitest mencakup utilitas validasi, password, sesi, transformasi produk/pesanan, format, serta beberapa komponen UI. Untuk komponen Storybook, jalankan `yarn storybook`.

## Batasan yang diketahui

- Seed mengosongkan dan membangun ulang tabel produk serta pesanan; jangan arahkan ke database berisi data yang ingin dipertahankan.
- Seed mengatur ulang kata sandi dan role untuk dua email demo setiap kali dijalankan.
- Tidak ada alur UI untuk membuat akun staf, reset kata sandi, atau mengelola pengguna; akun dibuat melalui seed atau proses administrasi database.
- Tidak ada checkout atau pembuatan pesanan dari sisi pelanggan; pesanan yang ditampilkan berasal dari seed atau integrasi data eksternal.
- Middleware halaman hanya menjaga navigasi; endpoint API tetap sumber otoritatif izin. Akses langsung API harus tetap diuji dengan role yang sesuai.
- README ini menjelaskan perilaku yang tersedia pada implementasi saat ini; integrasi pembayaran, pengiriman, ekspor laporan, dan audit log belum menjadi bagian dari cakupan aplikasi.

## Penggunaan AI

AI digunakan sebagai alat bantu dalam pengerjaan/dokumentasi proyek. Kode, skema, konfigurasi, dan klaim fitur pada README tetap perlu dipahami serta dapat dijelaskan oleh pengembang. Tidak ada kredensial atau informasi rahasia lingkungan yang dicantumkan di sini.

## Lisensi

Lihat [LICENSE](LICENSE).
