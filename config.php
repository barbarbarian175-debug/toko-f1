<?php
// Koneksi database + session. Ubah user/password sesuai XAMPP kamu.
session_start();
$db = new PDO('mysql:host=localhost;dbname=toko_admin;charset=utf8mb4', 'root', '', [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
function e($s){ return htmlspecialchars((string)$s, ENT_QUOTES); }
function rp($n){ return 'Rp '.number_format($n,0,',','.'); }
// Dipanggil di atas halaman admin: selain admin langsung ditendang ke login
function wajib_admin(){ if(($_SESSION['role'] ?? '') !== 'admin'){ header('Location: ../login.php'); exit; } }