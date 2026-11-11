<?php
// Model sirkuit: baca dari tabel circuits.
class Circuit {
    public static function all(PDO $pdo): array {
        $st = $pdo->query("SELECT id, name, gp_name, city, country, length_km, turns, first_year, description, image FROM circuits ORDER BY name ASC");
        return array_map([self::class, 'row'], $st->fetchAll());
    }

    public static function find(PDO $pdo, int $id): ?array {
        $st = $pdo->prepare("SELECT id, name, gp_name, city, country, length_km, turns, first_year, description, image FROM circuits WHERE id = ?");
        $st->execute([$id]);
        $r = $st->fetch();
        return $r ? self::row($r) : null;
    }

    public static function row(array $r): array {
        return [
            "id" => (int) $r["id"],
            "name" => $r["name"],
            "gp_name" => $r["gp_name"],
            "city" => $r["city"],
            "country" => $r["country"],
            "length_km" => (float) $r["length_km"],
            "turns" => (int) $r["turns"],
            "first_year" => (int) $r["first_year"],
            "description" => $r["description"],
            "image" => $r["image"],
        ];
    }
}
