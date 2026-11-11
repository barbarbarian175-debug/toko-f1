<?php
// Health-check: status API + koneksi database + isi tabel utama.
require_once dirname(__DIR__) . '/config/database.php';

try {
    $pdo = database();
    $counts = [];
    foreach (['teams', 'drivers', 'circuits'] as $t) {
        $counts[$t] = (int) $pdo->query("SELECT COUNT(*) FROM `$t`")->fetchColumn();
    }
    jsonOut(['status' => 'ok', 'db' => 'ok', 'counts' => $counts]);
} catch (PDOException $e) {
    jsonOut(['status' => 'ok', 'db' => 'error', 'error' => 'Database f1_website belum di-import. Jalankan backend/database/schema.sql.'], 200);
}
