<?php
require '../config.php'; wajib_admin();
$hal = $_GET['hal'] ?? 'dashboard';
$st = $db->query("SELECT COALESCE(SUM(CASE WHEN status_bayar='Lunas' THEN total END),0) omzet, COUNT(*) jml, COALESCE(SUM(status_bayar='Pending'),0) pending FROM pesanan")->fetch();
$menipis = $db->query('SELECT COUNT(*) FROM produk WHERE stok<=5')->fetchColumn();
$pesanan = $db->query('SELECT * FROM pesanan ORDER BY tanggal DESC, id DESC')->fetchAll();
$produk  = $db->query('SELECT * FROM produk ORDER BY stok')->fetchAll();
$det = null;
if (isset($_GET['id'])) {   // detail pesanan pelanggan
  $q = $db->prepare('SELECT * FROM pesanan WHERE id=?'); $q->execute([$_GET['id']]); $det = $q->fetch();
  $i = $db->prepare('SELECT d.*, p.nama FROM detail_pesanan d JOIN produk p ON p.id=d.produk_id WHERE pesanan_id=?'); $i->execute([$_GET['id']]); $items = $i->fetchAll();
}
function nav($k,$t,$h){ echo '<a href="?hal='.$k.'" class="'.($h==$k?'on':'').'">'.$t.'</a>'; }
?>
<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin</title><link rel="stylesheet" href="../css/admin.css"></head><body>
<aside><h3>Admin Toko</h3>
  <?php nav('dashboard','Dashboard',$hal); nav('pesanan','Pesanan',$hal); nav('stok','Stok Baju',$hal); ?>
  <a href="../logout.php" class="out">Keluar</a></aside>
<main>
<?php if ($det): ?>
  <a href="?hal=pesanan">&larr; Kembali</a>
  <h2>Pesanan #<?= $det['id'] ?></h2>
  <div class="card"><p><b><?= e($det['nama_pelanggan']) ?></b><br><?= e($det['alamat']) ?><br><?= e($det['tanggal']) ?> &middot; <span class="b <?= $det['status_bayar'] ?>"><?= $det['status_bayar'] ?></span></p>
  <table><tr><th>Produk</th><th>Qty</th><th>Harga</th></tr>
  <?php foreach ($items as $r): ?><tr><td><?= e($r['nama']) ?></td><td><?= $r['qty'] ?></td><td><?= rp($r['harga']) ?></td></tr><?php endforeach; ?>
  <tr><th colspan="2">Total</th><th><?= rp($det['total']) ?></th></tr></table></div>

<?php elseif ($hal == 'dashboard'): ?>
  <h2>Dashboard</h2>
  <div class="stats">
    <div class="card"><small>Total Penjualan (Lunas)</small><h3><?= rp($st['omzet']) ?></h3></div>
    <div class="card"><small>Jumlah Pesanan</small><h3><?= $st['jml'] ?></h3></div>
    <div class="card"><small>Belum Dibayar</small><h3><?= $st['pending'] ?></h3></div>
    <div class="card"><small>Stok Menipis (&le;5)</small><h3><?= $menipis ?></h3></div>
  </div>

<?php elseif ($hal == 'pesanan'): ?>
  <h2>Pesanan</h2><p><?= count($pesanan) ?> pesanan ditemukan</p>
  <div class="card"><table><tr><th>ID</th><th>Nama</th><th>Alamat</th><th>Tanggal</th><th>Total</th><th>Status Bayar</th><th></th></tr>
  <?php foreach ($pesanan as $p): ?><tr>
    <td>#<?= $p['id'] ?></td><td><?= e($p['nama_pelanggan']) ?></td><td><?= e($p['alamat']) ?></td><td><?= $p['tanggal'] ?></td><td><?= rp($p['total']) ?></td>
    <td><form method="post" action="aksi.php"><input type="hidden" name="id" value="<?= $p['id'] ?>">
      <select name="status" class="b <?= $p['status_bayar'] ?>" onchange="this.form.submit()">
      <?php foreach (['Pending','Lunas','Gagal'] as $s): ?><option <?= $s==$p['status_bayar']?'selected':'' ?>><?= $s ?></option><?php endforeach; ?>
      </select></form></td>
    <td><a href="?id=<?= $p['id'] ?>">Detail</a></td></tr><?php endforeach; ?>
  </table></div>

<?php else: ?>
  <h2>Stok Baju</h2>
  <div class="card"><table><tr><th>Produk</th><th>Harga</th><th>Sisa Stok</th></tr>
  <?php foreach ($produk as $p): ?><tr><td><?= e($p['nama']) ?></td><td><?= rp($p['harga']) ?></td>
    <td><form method="post" action="aksi.php"><input type="hidden" name="id" value="<?= $p['id'] ?>">
      <input type="number" name="stok" value="<?= $p['stok'] ?>" min="0" class="<?= $p['stok']<=5?'low':'' ?>"><button>Simpan</button></form></td></tr><?php endforeach; ?>
  </table></div>
<?php endif; ?>
</main></body></html>