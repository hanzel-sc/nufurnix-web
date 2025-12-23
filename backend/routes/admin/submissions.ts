import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { submissionService } from '../../services/submission.service.ts';
import { authenticateAdmin } from '../../middleware/auth.middleware.ts';

const querySchema = z.object({
  type: z.enum(['ENQUIRY', 'ORDER']).optional(),
  status: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED']),
});

export default async function adminSubmissionRoutes(server: FastifyInstance) {
  server.addHook('onRequest', authenticateAdmin);

  server.get('/', async (request, reply) => {
    const result = querySchema.safeParse(request.query);

    if (!result.success) {
      return reply.status(400).send({
        error: 'Invalid query parameters',
        details: result.error.flatten(),
      });
    }

    const submissions = await submissionService.getSubmissions(result.data);

    return { submissions };
  });

  server.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const submission = await submissionService.getSubmissionById(id);

    return { submission };
  });

  server.put('/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string };
    const result = updateStatusSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: result.error.flatten(),
      });
    }

    const order = await submissionService.updateOrderStatus(id, result.data.status);

    return { order };
  });

  server.get('/export', async (request, reply) => {
    const csv = await submissionService.exportSubmissions();

    reply.header('Content-Type', 'text/csv');
    reply.header('Content-Disposition', 'attachment; filename=submissions.csv');

    return csv;
  });
}