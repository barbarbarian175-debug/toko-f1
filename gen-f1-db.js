/* Generate backend/database/schema.sql dari data yang sudah ada di situs:
   - teamsData        <- js/pages/teams.js
   - circuitsData + circuitImages <- js/utils/script.js
   - DETAIL_PHOTOS    <- js/pages/pembalap.js (sudah lokal setelah lokalisasi gambar)
   Pembalap diambil dari daftar drivers di teamsData + nomor/kebangsaan grid 2026.
   Run: node gen-f1-db.js  ->  writes backend/database/schema.sql */
const fs = require("fs");
const vm = require("vm");
const path = require("path");
const dir = __dirname;

function grabArray(file, mark, varName) {
  const src = fs.readFileSync(path.join(dir, file), "utf8");
  const start = src.indexOf(mark);
  if (start < 0) throw new Error("not found: " + mark + " in " + file);
  const end = src.indexOf("];", start);
  const sb = {};
  vm.createContext(sb);
  return vm.runInContext(src.slice(start, end + 2) + "\n;" + varName, sb);
}
function grabObject(file, mark, varName) {
  const src = fs.readFileSync(path.join(dir, file), "utf8");
  const start = src.indexOf(mark);
  if (start < 0) throw new Error("not found: " + mark + " in " + file);
  const end = src.indexOf("};", start);
  const sb = {};
  vm.createContext(sb);
  return vm.runInContext(src.slice(start, end + 2) + "\n;" + varName, sb);
}

const teams = grabArray("js/pages/teams.js", "const teamsData = [", "teamsData");
const circuits = grabArray("js/utils/script.js", "const circuitsData = [", "circuitsData");
const circuitImages = grabObject("js/utils/script.js", "const circuitImages = {", "circuitImages");
const photos = grabObject("js/pages/pembalap.js", "const DETAIL_PHOTOS = {", "DETAIL_PHOTOS");

/* Nomor & kebangsaan grid 2026 (data publik F1). */
const DRIVER_INFO = {
  "George Russell": [63, "Inggris"], "Andrea Kimi Antonelli": [12, "Italia"],
  "Charles Leclerc": [16, "Monako"], "Lewis Hamilton": [44, "Inggris"],
  "Lando Norris": [4, "Inggris"], "Oscar Piastri": [81, "Australia"],
  "Max Verstappen": [1, "Belanda"], "Isack Hadjar": [6, "Prancis"],
  "Liam Lawson": [30, "Selandia Baru"], "Arvid Lindblad": [41, "Inggris"],
  "Pierre Gasly": [10, "Prancis"], "Franco Colapinto": [43, "Argentina"],
  "Fernando Alonso": [14, "Spanyol"], "Lance Stroll": [18, "Kanada"],
  "Alex Albon": [23, "Thailand"], "Carlos Sainz": [55, "Spanyol"],
  "Esteban Ocon": [31, "Prancis"], "Oliver Bearman": [87, "Inggris"],
  "Nico Hulkenberg": [27, "Jerman"], "Gabriel Bortoleto": [5, "Brasil"],
  "Sergio Pérez": [11, "Meksiko"], "Valtteri Bottas": [77, "Finlandia"],
};

const esc = s => String(s ?? "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
const drivers = [];
teams.forEach((t, ti) => {
  t.drivers.forEach(name => {
    const info = DRIVER_INFO[name];
    if (!info) throw new Error("DRIVER_INFO belum ada untuk: " + name);
    drivers.push({ name, number: info[0], nationality: info[1], team_id: ti + 1, photo: photos[name] || null });
  });
});

const teamRows = teams.map((t, i) =>
  `(${i + 1}, '${esc(t.name)}', '${esc(t.full)}', '${esc(t.color)}', '${esc(t.base)}', '${esc(t.pu)}', '${esc(t.car)}')`).join(",\n");
const driverRows = drivers.map((d, i) =>
  `(${i + 1}, '${esc(d.name)}', ${d.number}, '${esc(d.nationality)}', ${d.team_id}, ${d.photo ? "'" + esc(d.photo) + "'" : "NULL"})`).join(",\n");
const circuitRows = circuits.map((c, i) => {
  const len = parseFloat(String(c.length).replace(" km", "").replace(",", "."));
  const img = circuitImages[c.name] ? `assets/images/circuits/${circuitImages[c.name]}.png` : "";
  return `(${i + 1}, '${esc(c.name)}', '${esc(c.gp)}', '${esc(c.city)}', '${esc(c.country)}', ${len}, ${c.turns}, ${c.first}, '${esc(c.desc)}', '${esc(img)}')`;
}).join(",\n");

const sql = `-- F1 website | database f1_website
-- Cara pakai: import file ini lewat phpMyAdmin (tab Import), atau:
--   C:\\xampp82\\mysql\\bin\\mysql.exe -u root < backend\\database\\schema.sql
-- Dibuat otomatis dari data di js/pages/teams.js, js/utils/script.js dan
-- js/pages/pembalap.js — jangan edit manual, ubah file JS-nya lalu jalankan:
--   node gen-f1-db.js
-- Data: ${teams.length} tim, ${drivers.length} pembalap, ${circuits.length} sirkuit (musim 2026).

CREATE DATABASE IF NOT EXISTS f1_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE f1_website;

CREATE TABLE IF NOT EXISTS teams (
  id INT PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  color VARCHAR(10) NOT NULL,
  base VARCHAR(80) NOT NULL,
  power_unit VARCHAR(40) NOT NULL,
  car_img VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS drivers (
  id INT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  number INT NOT NULL,
  nationality VARCHAR(40) NOT NULL,
  team_id INT NOT NULL,
  photo VARCHAR(255) NULL,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS circuits (
  id INT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  gp_name VARCHAR(80) NOT NULL,
  city VARCHAR(80) NOT NULL,
  country VARCHAR(60) NOT NULL,
  length_km DECIMAL(5,3) NOT NULL,
  turns INT NOT NULL,
  first_year INT NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NOT NULL
);

INSERT INTO teams (id, name, full_name, color, base, power_unit, car_img) VALUES
${teamRows}
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), color = VALUES(color), base = VALUES(base), power_unit = VALUES(power_unit), car_img = VALUES(car_img);

INSERT INTO drivers (id, name, number, nationality, team_id, photo) VALUES
${driverRows}
ON DUPLICATE KEY UPDATE number = VALUES(number), nationality = VALUES(nationality), team_id = VALUES(team_id), photo = VALUES(photo);

INSERT INTO circuits (id, name, gp_name, city, country, length_km, turns, first_year, description, image) VALUES
${circuitRows}
ON DUPLICATE KEY UPDATE gp_name = VALUES(gp_name), city = VALUES(city), country = VALUES(country), length_km = VALUES(length_km), turns = VALUES(turns), first_year = VALUES(first_year), description = VALUES(description), image = VALUES(image);
`;

fs.writeFileSync(path.join(dir, "backend/database/schema.sql"), sql);
console.log(`schema.sql written: ${teams.length} teams, ${drivers.length} drivers (${drivers.filter(d => d.photo).length} dengan foto), ${circuits.length} circuits`);
