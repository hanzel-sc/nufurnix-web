import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authService } from '../../services/auth.service';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default async function adminAuthRoutes(server: FastifyInstance) {
  server.post('/login', async (request, reply) => {
    const result = loginSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: result.error.flatten(),
      });
    }

    const admin = await authService.login(result.data.email, result.data.password);

    const token = server.jwt.sign({
      id: admin.id,
      email: admin.email,
    });

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    };
  });
}