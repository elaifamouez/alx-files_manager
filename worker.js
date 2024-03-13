import Queue from 'bull';
import imageThumb from 'image-thumbnail';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import dbClient from './utils/db';

const fileQueue = new Queue('fileQueue');
const userQueue = new Queue('userQueue');

fileQueue.process(async (job) => {
  try {
    const { fileId, userId } = job.data;
    if (!fileId) throw new Error('Missing fileId');
    if (!userId) throw new Error('Missing userId');

    const file = await dbClient.dbClient.collection('files').findOne({ _id: ObjectId(fileId), userId: ObjectId(userId) });
    if (!file) throw new Error('File not found');
    const path = file.localPath;
    fs.writeFileSync(`${path}_500`, await imageThumb(path, { width: 500 }));

    fs.writeFileSync(`${path}_250`, await imageThumb(path, { width: 250 }));

    fs.writeFileSync(`${path}_100`, await imageThumb(path, { width: 100 }));
  } catch (error) {
    console.error('An error occurred:', error);
  }
});

userQueue.process(async (job) => {
  try {
    const { userId } = job.data;
    if (!userId) throw new Error('Missing userId');
    // userId already objectid
    const user = await dbClient.dbClient.collection('users').findOne({ _id: ObjectId(userId) });
    if (!user) throw new Error('User not found');

    console.log(`Welcome ${user.email}!`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
});

export { fileQueue, userQueue };
