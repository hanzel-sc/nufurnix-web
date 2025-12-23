import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { submissionService } from '../../services/submission.service';

const submissionItemSchema = z.object({
  catalogItemId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

const createSubmissionSchema = z.object({
  type: z.enum(['ENQUIRY', 'ORDER']),
  customerName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  notes: z.string().max(1000).optional(),
  items: z.array(submissionItemSchema).min(1),
  deliveryAddress: z.string().min(10).max(500).optional(),
});

export default async function publicSubmissionRoutes(server: FastifyInstance) {
  server.post('/', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '15 minutes',
      },
    },
    handler: async (request, reply) => {
      const result = createSubmissionSchema.safeParse(request.body);

      if (!result.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: result.error.flatten(),
        });
      }

      const submission = await submissionService.createSubmission(result.data);

      return reply.status(201).send({
        submissionId: submission.id,
        type: submission.type,
        message: `Your ${submission.type.toLowerCase()} has been submitted successfully`,
      });
    },
  });
}