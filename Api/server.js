require('dotenv').config();
const express = require('express');
const cors = require('cors');
const clientesRoutes = require('./routes/clientes.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/clientes', clientesRoutes);
app.use('/api/proveedores', proveedoresRoutes);   // ← esta línea faltaba

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});