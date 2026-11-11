<?php
require '../config.php'; wajib_admin();
// Simpan perubahan status bayar / stok ke database
if (isset($_POST['status']))
  $db->prepare('UPDATE pesanan SET status_bayar=? WHERE id=?')->execute([$_POST['status'], $_POST['id']]);
if (isset($_POST['stok']))
  $db->prepare('UPDATE produk SET stok=? WHERE id=?')->execute([max(0,(int)$_POST['stok']), $_POST['id']]);
header('Location: ' . ($_SERVER['HTTP_REFERER'] ?? 'index.php')); exit;