import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all categories with destination count
   */
  async findAll() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { destinations: true },
        },
      },
    });

    // Format response
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color,
      destinationCount: category._count.destinations,
      displayOrder: category.displayOrder,
    }));
  }

  /**
   * Get single category by ID or slug
   */
  async findOne(idOrSlug: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        _count: {
          select: { destinations: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID or slug '${idOrSlug}' not found`);
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color,
      isActive: category.isActive,
      displayOrder: category.displayOrder,
      destinationCount: category._count.destinations,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  /**
   * Create new category
   */
  async create(createCategoryDto: CreateCategoryDto) {
    // Check if slug already exists
    const existing = await this.prisma.category.findUnique({
      where: { slug: createCategoryDto.slug },
    });

    if (existing) {
      throw new ConflictException(`Category with slug '${createCategoryDto.slug}' already exists`);
    }

    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });

    return category;
  }

  /**
   * Update category
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // Check if category exists
    const existing = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return category;
  }

  /**
   * Delete category (soft delete by setting isActive = false)
   */
  async remove(id: string) {
    // Check if category exists
    const existing = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { destinations: true },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    // Check if category has destinations
    if (existing._count.destinations > 0) {
      throw new ConflictException(
        `Cannot delete category with ${existing._count.destinations} destinations. Please reassign them first.`,
      );
    }

    // Soft delete by marking as inactive
    await this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });

    return { deleted: true };
  }
}
