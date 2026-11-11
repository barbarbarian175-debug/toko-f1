CREATE DATABASE IF NOT EXISTS toko_admin;
USE toko_admin;
CREATE TABLE users(id INT AUTO_INCREMENT PRIMARY KEY, nama VARCHAR(80), email VARCHAR(100) UNIQUE, password VARCHAR(255), role ENUM('admin','pembeli') DEFAULT 'pembeli');
CREATE TABLE produk(id INT AUTO_INCREMENT PRIMARY KEY, nama VARCHAR(100), harga INT, stok INT DEFAULT 0);
CREATE TABLE pesanan(id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, nama_pelanggan VARCHAR(80), alamat VARCHAR(200), tanggal DATE, total INT, status_bayar ENUM('Pending','Lunas','Gagal') DEFAULT 'Pending');
CREATE TABLE detail_pesanan(id INT AUTO_INCREMENT PRIMARY KEY, pesanan_id INT, produk_id INT, qty INT, harga INT,
  FOREIGN KEY(pesanan_id) REFERENCES pesanan(id) ON DELETE CASCADE, FOREIGN KEY(produk_id) REFERENCES produk(id));
INSERT INTO produk(nama,harga,stok) VALUES('Kaos Polos Hitam',75000,30),('Kemeja Flannel',150000,4),('Hoodie Oversize',220000,12);
INSERT INTO pesanan(nama_pelanggan,alamat,tanggal,total,status_bayar) VALUES('Brooklyn Zoe','Jl. Melati 10, Bandung','2026-10-30',150000,'Pending'),('John McCormick','Jl. Kenanga 5, Bogor','2026-10-31',295000,'Lunas');
INSERT INTO detail_pesanan(pesanan_id,produk_id,qty,harga) VALUES(1,2,1,150000),(2,1,1,75000),(2,3,1,220000);
