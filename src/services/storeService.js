const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk membuat toko baru
async function createStore(userId, storeName) {
  // Cek apakah user sudah memiliki toko
  const existingStore = await prisma.store.findUnique({
    where: { ownerId: userId },
  });

  if (existingStore) {
    throw new Error('User already owns a store');
  }

  // Membuat toko baru
  const store = await prisma.store.create({
    data: {
      store_name: storeName,
      owner: {
        connect: { id: userId },
      },
    },
  });

  return store;
}

// Fungsi untuk mendapatkan detail toko
async function getStore(userId) {
  const store = await prisma.store.findUnique({
    where: { ownerId: userId },
  });

  if (!store) {
    throw new Error('Store not found');
  }

  return store;
}

module.exports = {
  createStore,
  getStore,
};
