import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { CreateSubmissionInput } from '../types';
import { NotFoundError, ValidationError } from '../utils/errors';
import { notificationQueue } from './notification.service';

export class SubmissionService {
  async createSubmission(data: CreateSubmissionInput) {
    if (data.items.length === 0) {
      throw new ValidationError('Submission must contain at least one item');
    }

    if (data.type === 'ORDER' && !data.deliveryAddress) {
      throw new ValidationError('Delivery address is required for orders');
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const submission = await tx.submission.create({
        data: {
          type: data.type,
          customerName: data.customerName,
          email: data.email,
          phone: data.phone,
          notes: data.notes,
          items: {
            create: data.items.map((item) => ({
              catalogItemId: item.catalogItemId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              catalogItem: true,
            },
          },
        },
      });

      if (data.type === 'ORDER') {
        await tx.order.create({
          data: {
            submissionId: submission.id,
            deliveryAddress: data.deliveryAddress!,
            orderStatus: 'PLACED',
          },
        });
      }

      await notificationQueue.add('send-notification', {
        submissionId: submission.id,
        type: data.type,
        customerEmail: data.email,
        customerName: data.customerName,
      });

      return submission;
    });
  }

  async getSubmissions(filters?: { type?: string; status?: string }) {
    const where: any = {};

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.status) {
      where.order = {
        orderStatus: filters.status,
      };
    }

    return prisma.submission.findMany({
      where,
      include: {
        items: {
          include: {
            catalogItem: true,
          },
        },
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSubmissionById(id: string) {
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            catalogItem: true,
          },
        },
        order: true,
      },
    });

    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    return submission;
  }

  async updateOrderStatus(submissionId: string, status: string) {
    const submission = await this.getSubmissionById(submissionId);

    if (submission.type !== 'ORDER') {
      throw new ValidationError('Only orders can have status updates');
    }

    return prisma.order.update({
      where: { submissionId },
      data: { orderStatus: status as any },
    });
  }

  async exportSubmissions() {
    const submissions = await this.getSubmissions();

    const csvRows = [
      ['ID', 'Type', 'Customer', 'Email', 'Phone', 'Items', 'Status', 'Created At'].join(','),
    ];

    submissions.forEach((submission) => {
      const itemCount = submission.items.length;
      const status = submission.order?.orderStatus || 'N/A';
      csvRows.push(
        [
          submission.id,
          submission.type,
          submission.customerName,
          submission.email,
          submission.phone,
          itemCount,
          status,
          submission.createdAt.toISOString(),
        ].join(',')
      );
    });

    return csvRows.join('\n');
  }
}

export const submissionService = new SubmissionService();