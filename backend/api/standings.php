<?php
/* API klasemen: meneruskan data live dari Jolpica (pengganti Ergast).
   GET /toko/backend/api/standings.php                    -> klasemen pembalap musim berjalan
   GET /toko/backend/api/standings.php?type=constructor  -> klasemen konstruktor */
require __DIR__ . "/../config/database.php";

$type = (($_GET["type"] ?? "driver") === "constructor") ? "constructorStandings" : "driverStandings";
$url = "https://api.jolpi.ca/ergast/f1/current/" . $type . ".json";
$ctx = stream_context_create(["http" => ["timeout" => 10, "header" => "User-Agent: toko-f1/1.0"]]);
$body = @file_get_contents($url, false, $ctx);
if ($body === false) jsonOut(["ok" => false, "error" => "API klasemen tidak bisa dijangkau."], 502);
$d = json_decode($body, true);
if (!is_array($d)) jsonOut(["ok" => false, "error" => "Respons API klasemen tidak valid."], 502);
jsonOut(["ok" => true, "source" => "jolpi", "data" => $d["MRData"] ?? $d]);
