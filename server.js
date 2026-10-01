// Servidor mínimo: muestra el login y valida las credenciales del lado del servidor.
const express = require("express");
const crypto = require("crypto");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // Render asigna el puerto en la variable PORT

// Las credenciales NO se escriben en el código: se leen de variables de entorno.
// Si no existen (por ejemplo, probando en tu PC), se usan unas de prueba.
const USUARIO = process.env.APP_USER || "admin";
const CLAVE = process.env.APP_PASSWORD || "1234";
if (!process.env.APP_USER || !process.env.APP_PASSWORD) {
  console.warn("Aviso: usando credenciales de prueba (admin / 1234). Configura APP_USER y APP_PASSWORD en Render.");
}

// Permite leer los datos que envía el formulario
app.use(express.urlencoded({ extended: false }));

// Compara textos sin revelar por el tiempo de respuesta cuántos caracteres coinciden
function iguales(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

// Página de login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Validación del login
app.post("/login", (req, res) => {
  const { usuario = "", clave = "" } = req.body;
  const ok = iguales(usuario, USUARIO) & iguales(clave, CLAVE);
  if (!ok) return res.redirect("/?error=1");

  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hola mundo</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root { --tinta:#1d2b4a; --papel:#eef1f6; --cobalto:#3155e0; --gris:#5c6680; }
    * { box-sizing:border-box; margin:0; }
    body { min-height:100vh; display:grid; place-items:center; padding:2rem;
           background:var(--papel); color:var(--tinta);
           font-family:"Sora", system-ui, sans-serif; text-align:center; }
    h1 { font-size:clamp(3rem, 12vw, 7rem); font-weight:700; letter-spacing:-0.04em; line-height:1; }
    p { margin-top:1.25rem; color:var(--gris); }
    a { color:var(--cobalto); font-weight:700; }
    a:focus-visible { outline:3px solid var(--cobalto); outline-offset:3px; }
  </style>
</head>
<body>
  <main>
    <h1>Hola mundo</h1>
    <p>Entraste como ${String(usuario).replace(/[&<>"']/g, "")}. <a href="/">Cerrar sesión</a></p>
  </main>
</body>
</html>`);
});

app.listen(PORT, () => console.log(`Servidor listo en http://localhost:${PORT}`));
