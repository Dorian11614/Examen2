// routes/clientes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Función para enviar errores claros
function sendPgError(res, err, status = 400) {
  console.error("[/clientes] Error:", err); // se verá en logs de Render
  const msg = err?.detail || err?.message || "Error inesperado";
  return res.status(status).json({ error: msg });
}

// POST /clientes/registrar - Registrar cliente
router.post("/registrar", async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body || {};
    if (!nombre || !email || !telefono) {
      return res.status(400).json({ error: "nombre, email y telefono son obligatorios" });
    }

    const result = await pool.query(
      "INSERT INTO clientes (nombre, email, telefono) VALUES ($1, $2, $3) RETURNING *",
      [String(nombre).trim(), String(email).trim(), String(telefono).trim()]
    );

    return res.json(result.rows[0]);
  } catch (err) {
    return sendPgError(res, err, 400);
  }
});

// POST /clientes/login - Autenticación
router.post("/login", async (req, res) => {
  try {
    const { email, telefono } = req.body || {};
    if (!email || !telefono) {
      return res.status(400).json({ error: "email y telefono son obligatorios" });
    }

    const result = await pool.query(
      "SELECT * FROM clientes WHERE email = $1 AND telefono = $2",
      [String(email).trim(), String(telefono).trim()]
    );

    if (result.rows.length > 0) return res.json(result.rows[0]);
    return res.status(401).json({ error: "Credenciales inválidas" });
  } catch (err) {
    return sendPgError(res, err, 500);
  }
});

module.exports = router;

  }
});

module.exports = router;
