const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/registrar", async (req, res) => {
  const { nombre, email, telefono } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO clientes (nombre, email, telefono) VALUES ($1, $2, $3) RETURNING *",
      [nombre, email, telefono]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, telefono } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM clientes WHERE email = $1 AND telefono = $2",
      [email, telefono]
    );
    if (result.rows.length > 0) return res.json(result.rows[0]);
    res.status(401).json({ error: "Credenciales inválidas" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
