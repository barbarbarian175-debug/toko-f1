<?php
// Returns a basic JSON health-check response.
header('Content-Type: application/json; charset=utf-8');
require_once dirname(__DIR__) . '/config/database.php';
echo json_encode(['status' => 'ok']);
