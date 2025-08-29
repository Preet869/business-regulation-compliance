const redis = require('redis');

let client = null;

const connectRedis = async () => {
  try {
    // Skip Redis if explicitly disabled or no REDIS_URL provided
    if (process.env.REDIS_DISABLED === 'true' || !process.env.REDIS_URL) {
      console.log('⚠️ Redis disabled or no REDIS_URL provided - skipping Redis connection');
      return;
    }

    client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 10000,
        lazyConnect: true,
      },
    });

    client.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
      // Don't crash the server on Redis errors
    });

    client.on('connect', () => {
      console.log('✅ Connected to Redis');
    });

    client.on('ready', () => {
      console.log('✅ Redis client ready');
    });

    await client.connect();
  } catch (error) {
    console.error('❌ Error connecting to Redis:', error);
    // Don't crash the server on Redis connection failure
    console.log('⚠️ Continuing without Redis - caching will be disabled');
  }
};

const getRedisClient = () => {
  if (!client) {
    throw new Error('Redis client not initialized');
  }
  return client;
};

const setCache = async (key, value, ttl = 3600) => {
  try {
    if (!client) return; // Skip if Redis not available
    const client = getRedisClient();
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

const getCache = async (key) => {
  try {
    if (!client) return null; // Skip if Redis not available
    const client = getRedisClient();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
};

const deleteCache = async (key) => {
  try {
    if (!client) return; // Skip if Redis not available
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    console.error('Error deleting cache:', error);
  }
};

const clearCache = async () => {
  try {
    if (!client) return; // Skip if Redis not available
    const client = getRedisClient();
    await client.flushAll();
    console.log('✅ Cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  setCache,
  getCache,
  deleteCache,
  clearCache
};
