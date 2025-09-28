// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar rutas
const clientesRoutes = require("./routes/clientes");
const ordenesRoutes = require("./routes/ordenes");

const app = express();

// ===== Middlewares =====
app.use(cors());
app.use(express.json());

// ===== Frontend estático =====
app.use(express.static("public"));

// ===== Rutas API =====
app.use("/clientes", clientesRoutes);
app.use("/ordenes", ordenesRoutes);

// ===== Ruta de prueba =====
app.get("/api", (req, res) => {
  res.send("🚀 API Restaurante funcionando en Render");
});

// ===== Puerto =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});

