import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all categories',
    description: 'Returns all active categories with destination count',
  })
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return {
      success: true,
      data: categories,
    };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get category by ID or slug',
    description: 'Returns a single category with its details',
  })
  async findOne(@Param('id') id: string) {
    const category = await this.categoriesService.findOne(id);
    return {
      success: true,
      data: category,
    };
  }

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard) // TODO: Reativar autenticação
  // @Roles('admin')
  // @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Create new category',
    description: 'Creates a new category (Admin only - authentication required)',
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);
    return {
      success: true,
      message: 'Category created successfully',
      data: category,
    };
  }

  @Put(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard) // TODO: Reativar autenticação
  // @Roles('admin')
  // @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Update category',
    description: 'Updates an existing category (Admin only)',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.update(id, updateCategoryDto);
    return {
      success: true,
      message: 'Category updated successfully',
      data: category,
    };
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard) // TODO: Reativar autenticação
  // @Roles('admin')
  // @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete category',
    description: 'Deletes a category (Admin only)',
  })
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return {
      success: true,
      message: 'Category deleted successfully',
    };
  }
}
