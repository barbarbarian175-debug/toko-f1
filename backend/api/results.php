<?php
/* API hasil balapan: meneruskan data live dari Jolpica (pengganti Ergast).
   GET /toko/backend/api/results.php                        -> hasil balapan terakhir
   GET /toko/backend/api/results.php?season=2026&round=5   -> hasil ronde tertentu */
require __DIR__ . "/../config/database.php";

$season = preg_replace("/[^0-9a-z]/i", "", $_GET["season"] ?? "current") ?: "current";
$round = preg_replace("/[^0-9a-z]/i", "", $_GET["round"] ?? "last") ?: "last";
$url = "https://api.jolpi.ca/ergast/f1/{$season}/{$round}/results.json";
$ctx = stream_context_create(["http" => ["timeout" => 10, "header" => "User-Agent: toko-f1/1.0"]]);
$body = @file_get_contents($url, false, $ctx);
if ($body === false) jsonOut(["ok" => false, "error" => "API hasil balapan tidak bisa dijangkau."], 502);
$d = json_decode($body, true);
if (!is_array($d)) jsonOut(["ok" => false, "error" => "Respons API hasil tidak valid."], 502);
jsonOut(["ok" => true, "source" => "jolpi", "data" => $d["MRData"] ?? $d]);
