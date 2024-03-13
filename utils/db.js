import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * Class representing a client for interacting with Redis.
 * Author: Oluwatobiloba Light
 * File: redis.js
 */

class RedisClient {
  /**
   * Creates a new Redis client instance.
   */
  constructor() {
    this.client = createClient();

    this.client.on('error', (err) => {
      console.log(`Redis Client Error: ${err.message || err.toString()}`);
      // this.clientConnected = false;
    });

    this.clientConnected = false;

    this.client.on('connect', () => {
      this.clientConnected = true;
    });
    // this.clientConnected = true;
  }

  /**
   * Checks if the connection to Redis is successful
   *
   * @returns {Boolean} - true if connected, otherwise false.
   */
  isAlive() {
    return this.clientConnected;
  }

  /**
   * Asynchronously checks and returns the value for a Redis key
   * @param {String} key - key stored in redis
   *
   * @returns {Promise<string|object|null>} A promise that resolves to the
   * retrieved value (string) or null if not found.
   */
  async get(key) {
    return promisify(this.client.get).bind(this.client)(key);
  }

  /**
   * Asynchronously stores the value for a key with expiration in Redis
   * @param {String} key - Key for the data to be stored in Redis.
   * @param {String | Number | Boolean} value - The value to store
   * (can be any data type supported by Redis).
   * @param {number} duration - The expiration time in seconds for the key-value pair.
   * @returns {Promise<boolean>} A promise that resolves to true if successful, false otherwise.
   */
  async set(key, value, duration) {
    await promisify(this.client.set).bind(this.client)(key, value, 'EX', duration);
  }

  /**
   * Asynchronously removes a key-value pair from Redis.
   *
   * @param {string} key - The key of the data to remove.
   * @returns {Promise<boolean>} A promise that resolves to true if removed
   * successfully, false otherwise.
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
