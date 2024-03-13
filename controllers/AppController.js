import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  static getStatus(req, res) {
    const redisLive = redisClient.isAlive();
    const dbLive = dbClient.isAlive();
    res.status(200).json({ redis: redisLive, db: dbLive });
  }

  static async getStats(req, res) {
    const usersTotal = await dbClient.nbUsers();
    const filesTotal = await dbClient.nbFiles();
    res.status(200).json({ users: usersTotal, files: filesTotal });
  }
}

export default AppController;
