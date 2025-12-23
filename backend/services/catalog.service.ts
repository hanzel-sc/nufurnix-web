import { prisma } from '../config/database';
import { CreateCatalogItemInput, UpdateCatalogItemInput } from '../types';
import { NotFoundError } from '../utils/errors';

export class CatalogService {
  async getPublicCatalog(filters?: {
    category?: string;
    isActive?: boolean;
  }) {
    return prisma.catalogItem.findMany({
      where: {
        isActive: filters?.isActive ?? true,
        ...(filters?.category && { category: filters.category }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getItemById(id: string) {
    const item = await prisma.catalogItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundError('Catalog item not found');
    }

    return item;
  }

  async getAllItems() {
    return prisma.catalogItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createItem(data: CreateCatalogItemInput) {
    return prisma.catalogItem.create({
      data: {
        ...data,
        isActive: true,
      },
    });
  }

  async updateItem(id: string, data: UpdateCatalogItemInput) {
    const item = await this.getItemById(id);

    return prisma.catalogItem.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async deleteItem(id: string) {
    const item = await this.getItemById(id);

    return prisma.catalogItem.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

export const catalogService = new CatalogService();