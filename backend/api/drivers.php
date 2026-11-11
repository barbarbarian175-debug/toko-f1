<?php
/* API pembalap F1.
   GET /toko/backend/api/drivers.php           -> semua pembalap
   GET /toko/backend/api/drivers.php?id=5      -> satu pembalap
   GET /toko/backend/api/drivers.php?team=3    -> pembalap satu tim */
require __DIR__ . "/../config/database.php";
require __DIR__ . "/../models/Driver.php";

try { $pdo = database(); } catch (PDOException $e) {
    jsonOut(["ok" => false, "error" => "Database tidak tersedia. Import backend/database/schema.sql dulu."], 500);
}

if (!empty($_GET["id"])) {
    $d = Driver::find($pdo, (int) $_GET["id"]);
    if (!$d) jsonOut(["ok" => false, "error" => "Pembalap tidak ditemukan."], 404);
    jsonOut(["ok" => true, "driver" => $d]);
}

jsonOut(["ok" => true, "drivers" => Driver::all($pdo, isset($_GET["team"]) ? (int) $_GET["team"] : null)]);
