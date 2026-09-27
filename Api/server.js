require('dotenv').config();
const express = require('express');
const cors = require('cors');
const clientesRoutes = require('./routes/clientes.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/clientes', clientesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});