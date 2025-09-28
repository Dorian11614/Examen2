const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { cliente_id, platillo_nombre, notas } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO ordenes (cliente_id, platillo_nombre, notas) VALUES ($1, $2, $3) RETURNING *",
      [cliente_id, platillo_nombre, notas]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/cliente/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ordenes WHERE cliente_id = $1 ORDER BY creado DESC",
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/estado", async (req, res) => {
  const { estado } = req.body;
  try {
    const result = await pool.query(
      "UPDATE ordenes SET estado = $1 WHERE id = $2 RETURNING *",
      [estado, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
