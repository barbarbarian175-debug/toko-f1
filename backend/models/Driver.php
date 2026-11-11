<?php
// Model pembalap: baca dari tabel drivers (join teams untuk nama tim).
class Driver {
    public static function all(PDO $pdo, ?int $teamId = null): array {
        $sql = "SELECT d.id, d.name, d.number, d.nationality, d.team_id, d.photo, t.name AS team
                FROM drivers d JOIN teams t ON t.id = d.team_id";
        $params = [];
        if ($teamId) { $sql .= " WHERE d.team_id = ?"; $params[] = $teamId; }
        $sql .= " ORDER BY d.name ASC";
        $st = $pdo->prepare($sql);
        $st->execute($params);
        return array_map([self::class, 'row'], $st->fetchAll());
    }

    public static function find(PDO $pdo, int $id): ?array {
        $st = $pdo->prepare("SELECT d.id, d.name, d.number, d.nationality, d.team_id, d.photo, t.name AS team
                             FROM drivers d JOIN teams t ON t.id = d.team_id WHERE d.id = ?");
        $st->execute([$id]);
        $r = $st->fetch();
        return $r ? self::row($r) : null;
    }

    public static function row(array $r): array {
        return [
            "id" => (int) $r["id"],
            "name" => $r["name"],
            "number" => (int) $r["number"],
            "nationality" => $r["nationality"],
            "team_id" => (int) $r["team_id"],
            "team" => $r["team"],
            "photo" => $r["photo"],
        ];
    }
}
