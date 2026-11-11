<?php
// Model tim: baca dari tabel teams.
class Team {
    public static function all(PDO $pdo): array {
        $st = $pdo->query("SELECT id, name, full_name, color, base, power_unit, car_img FROM teams ORDER BY name ASC");
        return array_map([self::class, 'row'], $st->fetchAll());
    }

    public static function find(PDO $pdo, int $id): ?array {
        $st = $pdo->prepare("SELECT id, name, full_name, color, base, power_unit, car_img FROM teams WHERE id = ?");
        $st->execute([$id]);
        $r = $st->fetch();
        return $r ? self::row($r) : null;
    }

    public static function row(array $r): array {
        return [
            "id" => (int) $r["id"],
            "name" => $r["name"],
            "full_name" => $r["full_name"],
            "color" => $r["color"],
            "base" => $r["base"],
            "power_unit" => $r["power_unit"],
            "car_img" => $r["car_img"],
        ];
    }
}
