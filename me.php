<?php
// Dipanggil JavaScript di beranda untuk tahu siapa yang sedang login
require 'config.php';
header('Content-Type: application/json');
echo json_encode(isset($_SESSION['uid'])
  ? ['login'=>true,'nama'=>$_SESSION['nama'],'role'=>$_SESSION['role']]
  : ['login'=>false]);
