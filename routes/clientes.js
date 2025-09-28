// routes/clientes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Función para enviar errores claros y ver logs en Render
function sendPgError(res, err, fallbackStatus = 400, tag = "/clientes") {
  console.error(`[${tag}]`, err);
  const msg = err?.detail || err?.message || "Error inesperado";
  return res.status(fallbackStatus).json({ error: msg });
}

// POST /clientes/registrar  (idempotente por email)
router.post("/registrar", async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body || {};
    if (!nombre || !email || !telefono) {
      return res
        .status(400)
        .json({ error: "nombre, email y telefono son obligatorios" });
    }

    // Inserción idempotente: si el email ya existe, actualiza nombre/teléfono y devuelve el registro
    const result = await pool.query(
      `INSERT INTO clientes (nombre, email, telefono)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET
         nombre = EXCLUDED.nombre,
         telefono = EXCLUDED.telefono
       RETURNING *`,
      [String(nombre).trim(), String(email).trim(), String(telefono).trim()]
    );

    return res.json(result.rows[0]);
  } catch (err) {
    return sendPgError(res, err, 400, "/clientes/registrar");
  }
});

// POST /clientes/login - Autenticación
router.post("/login", async (req, res) => {
  try {
    const { email, telefono } = req.body || {};
    if (!email || !telefono) {
      return res
        .status(400)
        .json({ error: "email y telefono son obligatorios" });
    }

    const q = await pool.query(
      "SELECT * FROM clientes WHERE email = $1 AND telefono = $2",
      [String(email).trim(), String(telefono).trim()]
    );

    if (q.rows.length > 0) {
      return res.json(q.rows[0]);
    }
    return res.status(401).json({ error: "Credenciales inválidas" });
  } catch (err) {
    return sendPgError(res, err, 500, "/clientes/login");
  }
});

module.exports = router;

