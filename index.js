// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const clientesRoutes = require("./routes/clientes");
const ordenesRoutes = require("./routes/ordenes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/clientes", clientesRoutes);
app.use("/ordenes", ordenesRoutes);

// Ruta raíz para probar que funciona
app.get("/", (req, res) => {
  res.send("🚀 API Restaurante funcionando en Render");
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
