const app = require('./app');

const PORT = process.env.PORT || 5000;

// Menjalankan server HTTP Express di port yang ditentukan (default: 5000)
app.listen(PORT, () => {
  console.log(`HealthMap Bali API running on http://localhost:${PORT}`);
});
