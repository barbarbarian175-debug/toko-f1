<?php
/* API tim F1 (beserta daftar pembalap tiap tim).
   GET /toko/backend/api/teams.php        -> semua tim
   GET /toko/backend/api/teams.php?id=3   -> satu tim */
require __DIR__ . "/../config/database.php";
require __DIR__ . "/../models/Team.php";
require __DIR__ . "/../models/Driver.php";

try { $pdo = database(); } catch (PDOException $e) {
    jsonOut(["ok" => false, "error" => "Database tidak tersedia. Import backend/database/schema.sql dulu."], 500);
}

if (!empty($_GET["id"])) {
    $t = Team::find($pdo, (int) $_GET["id"]);
    if (!$t) jsonOut(["ok" => false, "error" => "Tim tidak ditemukan."], 404);
    $t["drivers"] = Driver::all($pdo, $t["id"]);
    jsonOut(["ok" => true, "team" => $t]);
}

$teams = Team::all($pdo);
foreach ($teams as &$t) $t["drivers"] = Driver::all($pdo, $t["id"]);
jsonOut(["ok" => true, "teams" => $teams]);
