<?php
/* API sirkuit F1.
   GET /toko/backend/api/circuits.php       -> semua sirkuit
   GET /toko/backend/api/circuits.php?id=5  -> satu sirkuit */
require __DIR__ . "/../config/database.php";
require __DIR__ . "/../models/Circuit.php";

try { $pdo = database(); } catch (PDOException $e) {
    jsonOut(["ok" => false, "error" => "Database tidak tersedia. Import backend/database/schema.sql dulu."], 500);
}

if (!empty($_GET["id"])) {
    $c = Circuit::find($pdo, (int) $_GET["id"]);
    if (!$c) jsonOut(["ok" => false, "error" => "Sirkuit tidak ditemukan."], 404);
    jsonOut(["ok" => true, "circuit" => $c]);
}

jsonOut(["ok" => true, "circuits" => Circuit::all($pdo)]);
