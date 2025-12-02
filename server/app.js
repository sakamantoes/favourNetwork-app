import express from 'express';
import cors from 'cors';
import trafficRoutes from './routes/traffic.js';
import alertRoutes from './routes/alerts.js';
import threatRoutes from './routes/threats.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/traffic', trafficRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/threats', threatRoutes);

app.get("/", async (req,res) => {
  res.send("running favour app")
})

app.listen(PORT, () => {
  console.log(`🚀 IDS Server running on port ${PORT}`);
});