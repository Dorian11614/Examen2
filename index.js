// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===== Middlewares =====
app.use(cors());
app.use(express.json());              // Parseo de JSON del body
app.use(express.static("public"));    // Servir frontend de /public

// ===== Rutas API =====
const clientesRoutes = require("./routes/clientes");
const ordenesRoutes  = require("./routes/ordenes");
app.use("/clientes", clientesRoutes);
app.use("/ordenes",  ordenesRoutes);

// ===== Ruta de prueba backend =====
app.get("/api", (req, res) => {
  res.send("🚀 API Restaurante funcionando en Render");
});

// ===== Ruta de diagnóstico (opcional) =====
// Verifica conexión a BD y existencia de tablas 'clientes' y 'ordenes'
app.get("/debug/db", async (req, res, next) => {
  try {
    const pool = require("./db");
    const { rows: ping } = await pool.query("SELECT NOW() AS ahora");
    const { rows: tablas } = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public' AND table_name IN ('clientes','ordenes')
      ORDER BY table_name
    `);
    res.json({ ok: true, ping: ping[0], tablas });
  } catch (e) {
    next(e);
  }
});

// ===== Manejador global de errores (si algo no fue capturado antes) =====
app.use((err, req, res, next) => {
  console.error("[GLOBAL ERROR]", err);
  const msg = err?.detail || err?.message || "Error inesperado";
  res.status(500).json({ error: msg });
});

// ===== Arranque =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});


