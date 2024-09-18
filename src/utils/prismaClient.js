// src/prismaClient.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Check Prisma connection
(async () => {
  try {
    await prisma.$connect();
    console.log('Prisma successfully connected to the database!');
  } catch (error) {
    console.error('Error connecting to the database with Prisma:', error);
  }
})();

module.exports = prisma;
