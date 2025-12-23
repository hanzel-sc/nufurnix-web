import { Queue } from 'bullmq';
import { redis } from '../config/redis';
import { NotificationJobData } from '../types';

export const notificationQueue = new Queue<NotificationJobData>('notifications', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      count: 100,
      age: 24 * 3600,
    },
    removeOnFail: {
      count: 1000,
      age: 7 * 24 * 3600,
    },
  },
});