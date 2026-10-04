require('dotenv').config();

const express = require('express');
const cors = require('cors');

const clientesRoutes = require('./routes/clientes.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const ventasRoutes = require('./routes/ventas.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/clientes', clientesRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/inventarios', inventarioRoutes);
app.use('/api/ventas', ventasRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`);
});