import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { UnauthorizedError, ConflictError } from '../utils/errors';

export class AuthService {
  async login(email: string, password: string) {
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    };
  }

  async createAdmin(email: string, password: string, name: string) {
    const existing = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ConflictError('Admin user already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
        name,
        isActive: true,
      },
    });

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    };
  }
}

export const authService = new AuthService();