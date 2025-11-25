# AI RPG: React Edition

Ini adalah proyek RPG berbasis teks yang ditenagai oleh AI, dibangun ulang dari awal menggunakan React dan Vite.

## Deskripsi

Proyek ini bertujuan untuk menciptakan pengalaman bermain peran yang dinamis di mana cerita dan interaksi karakter dihasilkan secara real-time oleh model bahasa besar (LLM) dari Google Gemini. Proyek ini telah dimigrasikan dari JavaScript vanilla ke React untuk memungkinkan pengembangan fitur yang lebih modern dan mudah dikelola.

## Fitur Utama (Saat Ini)

-   **Struktur Proyek Modern:** Dibangun dengan React, Vite, dan Tailwind CSS.
-   **Pengaturan API Key:** Modal interaktif untuk pengguna memasukkan dan memvalidasi API Key Google Gemini mereka.
-   **Dropdown Kustom:** Komponen dropdown dengan gaya "gaming" untuk pemilihan model AI.
-   **Deployment Otomatis:** Dikonfigurasi dengan GitHub Actions untuk deployment otomatis ke GitHub Pages.

## Memulai

### Prasyarat

-   Node.js (versi 20 atau lebih tinggi)
-   npm (biasanya terinstal bersama Node.js)
-   API Key Google Gemini

### Instalasi & Menjalankan Secara Lokal

1.  **Clone repositori:**
    ```bash
    git clone https://github.com/nama-pengguna-anda/nama-repositori-anda.git
    cd nama-repositori-anda
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    ```

3.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```
    Aplikasi sekarang akan berjalan di `http://localhost:5173`.

### Membangun untuk Produksi

Untuk membuat versi produksi yang dioptimalkan, jalankan:

```bash
npm run build
```
Perintah ini akan menghasilkan direktori `dist` yang berisi file-file statis yang siap untuk di-deploy.
