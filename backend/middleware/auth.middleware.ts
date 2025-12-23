import { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '../utils/errors';
import { AdminJWTPayload, AuthenticatedRequest } from '../types';

export async function authenticateAdmin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const payload = await request.jwtVerify<AdminJWTPayload>();
    (request as AuthenticatedRequest).admin = payload;
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}