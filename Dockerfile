# Gunakan image Node.js resmi sebagai image induk
FROM node:20-alpine

# Set direktori kerja di dalam kontainer
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi aplikasi
RUN npm install

# Salin sisa kode aplikasi Anda
COPY . .

# Expose port yang digunakan aplikasi Anda
EXPOSE 8000

# Perintah untuk menjalankan aplikasi Anda
CMD ["yarn", "serve:development"]