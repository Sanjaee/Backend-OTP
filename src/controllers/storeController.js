const { createStore, getStore } = require('../services/storeService');

// Fungsi untuk menangani pembuatan toko
async function handleCreateStore(req, res) {
  const { userId, storeName } = req.body; // Ambil userId dan storeName dari body

  try {
    const store = await createStore(userId, storeName);
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Fungsi untuk mendapatkan detail toko
async function handleGetStore(req, res) {
  const { userId } = req.params; // Ambil userId dari params

  try {
    const store = await getStore(userId);
    res.status(200).json(store);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

module.exports = {
  handleCreateStore,
  handleGetStore,
};
