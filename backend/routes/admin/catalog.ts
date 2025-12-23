import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { catalogService } from '../../services/catalog.service.ts';
import { authenticateAdmin } from '../../middleware/auth.middleware.ts';

const createCatalogItemSchema = z.object({
  name: z.string().min(2).max(200),
  category: z.string().min(2).max(100),
  description: z.string().min(10),
  specifications: z.record(z.string(), z.string()),
  applications: z.array(z.string()),
  images: z.array(z.string().url()),
});

const updateCatalogItemSchema = createCatalogItemSchema
  .partial()
  .extend({
    isActive: z.boolean().optional(),
  });

export default async function adminCatalogRoutes(server: FastifyInstance) {
  server.addHook('onRequest', authenticateAdmin);

  server.get('/', async (request, reply) => {
    const items = await catalogService.getAllItems();
    return { items };
  });

  server.post('/', async (request, reply) => {
    const result = createCatalogItemSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: result.error.flatten(),
      });
    }

    const item = await catalogService.createItem(result.data);

    return reply.status(201).send({ item });
  });

  server.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const result = updateCatalogItemSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: result.error.flatten(),
      });
    }

    const item = await catalogService.updateItem(id, result.data);

    return { item };
  });

  server.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    await catalogService.deleteItem(id);

    return reply.status(204).send();
  });
}