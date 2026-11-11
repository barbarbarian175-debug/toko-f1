<?php
require 'config.php';
$err = ''; $go = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = trim($_POST['email']); $pw = $_POST['password'];
  if (isset($_POST['register'])) {            // daftar: role SELALU pembeli
    $c = $db->prepare('SELECT id FROM users WHERE email=?'); $c->execute([$email]);
    if ($c->fetch()) $err = 'Email sudah terdaftar';
    else {
      $db->prepare("INSERT INTO users(nama,email,password,role) VALUES(?,?,?,'pembeli')")
         ->execute([trim($_POST['nama']), $email, password_hash($pw, PASSWORD_DEFAULT)]);
      $err = 'Daftar berhasil, silakan login';
    }
  } else {                                     // login
    $s = $db->prepare('SELECT * FROM users WHERE email=?'); $s->execute([$email]); $u = $s->fetch();
    if ($u && password_verify($pw, $u['password'])) {
      session_regenerate_id(true);
      $_SESSION['uid'] = $u['id']; $_SESSION['nama'] = $u['nama']; $_SESSION['role'] = $u['role'];
      $go = $u['role'] === 'admin' ? 'admin/index.php' : 'index.html';
    } else $err = 'Email atau password salah';
  }
}
?>
<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Login</title><link rel="stylesheet" href="css/loader.css"><style>
*{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#cfcfcf;padding:20px}
.wrap{display:grid;grid-template-columns:1fr 1fr;width:min(960px,100%);min-height:620px;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 20px 50px #5b6bb355}
/* Kiri: taruh gambarmu di assets/images/bg/login.jpg. Kalau belum ada, otomatis pakai gradasi malam */
.art{position:relative;background:url('../assets/images/bg/login.jpg') center/cover,
  radial-gradient(circle at 30% 72%,#3aa06f 0,transparent 32%),radial-gradient(circle at 18% 48%,#2147b8 0,transparent 45%),
  radial-gradient(circle at 80% 12%,#070b24 0,transparent 50%),linear-gradient(160deg,#101a4a,#0a0f2e)}
.art h1{position:absolute;top:36%;left:0;right:0;margin:0;text-align:center;font-weight:300;font-size:34px;letter-spacing:.35em;color:#e6ecf5}
/* Kanan: form gaya Uiverse */
.form{display:flex;flex-direction:column;justify-content:center;gap:10px;padding:30px 44px}
.form h2{margin:0 0 6px;text-align:center;font-size:30px;font-weight:600;color:#151717}
.flex-column>label{color:#151717;font-weight:600}
.inputForm{border:1.5px solid #ecedec;border-radius:10px;height:50px;display:flex;align-items:center;padding-left:10px;transition:.2s ease-in-out}
.inputForm:focus-within{border-color:#2d79f3}
.input{margin-left:10px;border:0;border-radius:10px;width:100%;height:100%;font-size:14px;background:none}
.input:focus{outline:none}
.flex-row{display:flex;align-items:center;gap:10px;justify-content:space-between}
.flex-row>div>label{font-size:14px;color:#000}
.span{font-size:14px;margin-left:5px;color:#2d79f3;font-weight:500;cursor:pointer}
.button-submit{margin:20px 0 10px;background:#151717;border:0;color:#fff;font-size:15px;font-weight:500;border-radius:10px;height:50px;width:100%;cursor:pointer}
.p{text-align:center;color:#000;font-size:14px;margin:5px 0}
.btn{margin-top:10px;width:100%;height:50px;border-radius:10px;display:flex;justify-content:center;align-items:center;font-weight:500;gap:10px;border:1px solid #ededef;background:#fff;cursor:pointer;transition:.2s ease-in-out}
.btn:hover{border-color:#2d79f3}
.err{margin:0;padding:8px 10px;border-radius:8px;background:#fff0f0;color:#c0392b;font-size:13px}
.load{position:fixed;inset:0;background:#fff;display:grid;place-content:center;justify-items:center;gap:8px}
@media(max-width:760px){.wrap{grid-template-columns:1fr}.art{min-height:170px}.art h1{top:40%;font-size:26px}.form{padding:26px 22px}}
</style></head><body>
<?php if ($go): ?>
  <div class="load">
    <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
      <circle class="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330" stroke-linecap="round"></circle>
      <circle class="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110" stroke-linecap="round"></circle>
      <circle class="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
      <circle class="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
    </svg>
    <p>Selamat datang, <?= e($_SESSION['nama']) ?>...</p>
  </div>
  <script>setTimeout(()=>location.href='<?= $go ?>', 2500);</script>
<?php else: ?>
  <div class="wrap">
    <div class="art"><h1>WELCOME</h1></div>
    <form class="form" method="post">
      <h2 id="jdl">Masuk</h2>
      <?php if ($err): ?><p class="err"><?= e($err) ?></p><?php endif; ?>
      <div id="gn" hidden>
        <div class="flex-column"><label>Nama</label></div>
        <div class="inputForm"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>
          <input name="nama" id="nama" class="input" placeholder="Nama lengkap"></div>
      </div>
      <div class="flex-column"><label>Email</label></div>
      <div class="inputForm">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 32 32" height="20"><path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path></svg>
        <input type="email" name="email" class="input" placeholder="Masukkan email" required>
      </div>
      <div class="flex-column"><label>Password</label></div>
      <div class="inputForm">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="-64 0 512 512" height="20"><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path></svg>
        <input type="password" name="password" class="input" placeholder="Masukkan password" required>
      </div>
      <div class="flex-row">
        <div><input type="checkbox" id="rm"> <label for="rm">Ingat saya</label></div>
        <span class="span" onclick="belum()">Lupa password?</span>
      </div>
      <button class="button-submit" id="btn">Masuk</button>
      <p class="p"><span id="tx">Belum punya akun?</span><span class="span" id="tg">Daftar</span></p>
      <p class="p">Atau dengan</p>
      <div class="flex-row">
        <button type="button" class="btn" onclick="belum()"><svg viewBox="0 0 512 512" width="20" height="20"><path d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456C103.821,274.792,107.225,292.797,113.47,309.408z" fill="#FBBB00"/><path d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z" fill="#518EF8"/><path d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z" fill="#28B446"/><path d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0C318.115,0,375.068,22.126,419.404,58.936z" fill="#F14336"/></svg>Google</button>
        <button type="button" class="btn" onclick="belum()"><svg viewBox="0 0 22.773 22.773" width="20" height="20"><path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z"/><path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z"/></svg>Apple</button>
      </div>
    </form>
  </div>
  <script>
    let reg = false;
    const belum = () => alert('Fitur ini belum aktif');
    tg.onclick = () => { reg = !reg;
      gn.hidden = !reg; nama.required = reg;
      jdl.textContent = btn.textContent = reg ? 'Daftar' : 'Masuk'; btn.name = reg ? 'register' : '';
      tx.textContent = reg ? 'Sudah punya akun?' : 'Belum punya akun?'; tg.textContent = reg ? 'Masuk' : 'Daftar'; };
  </script>
<?php endif; ?>
</body></html>