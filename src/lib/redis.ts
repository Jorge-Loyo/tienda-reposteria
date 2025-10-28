import { createClient } from 'redis';

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    tls: true, // Valkey serverless requiere TLS
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));

let isConnected = false;

async function connectRedis() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
}

export async function setCache(key: string, value: any, ttl: number = 3600) {
  try {
    await connectRedis();
    await client.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
}

export async function getCache(key: string) {
  try {
    await connectRedis();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

export async function deleteCache(key: string) {
  try {
    await connectRedis();
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Redis delete error:', error);
    return false;
  }
}