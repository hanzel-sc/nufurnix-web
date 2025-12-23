import { Worker, Job } from 'bullmq';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';
import { NotificationJobData } from '../types';

const worker = new Worker<NotificationJobData>(
  'notifications',
  async (job: Job<NotificationJobData>) => {
    const { submissionId, type, customerEmail, customerName } = job.data;

    logger.info(
      {
        submissionId,
        type,
        customerEmail,
      },
      'Processing notification job'
    );

    await sendEmailNotification(submissionId, type, customerEmail, customerName);
    await sendWhatsAppNotification(submissionId, type, customerName);

    logger.info({ submissionId }, 'Notification sent successfully');
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

async function sendEmailNotification(
  submissionId: string,
  type: string,
  customerEmail: string,
  customerName: string
) {
  logger.info(
    {
      to: customerEmail,
      subject: `${type} Confirmation - ${submissionId}`,
    },
    'Email notification would be sent'
  );
}

async function sendWhatsAppNotification(
  submissionId: string,
  type: string,
  customerName: string
) {
  logger.info(
    {
      submissionId,
      type,
      customerName,
    },
    'WhatsApp notification would be sent'
  );
}

worker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Job completed');
});

worker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err }, 'Job failed');
});

logger.info('Notification worker started');

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing worker');
  await worker.close();
  process.exit(0);
});