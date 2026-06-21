import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/interfaces';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ========== USER ENDPOINTS ==========

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: RequestUser) {
    const userId = user.id;
    const profile = await this.usersService.getProfile(userId);
    return { success: true, data: profile };
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@Body() updateData: any, @CurrentUser() user: RequestUser) {
    const userId = user.id;
    const updated = await this.usersService.updateProfile(userId, updateData);
    return { success: true, message: 'Profile updated', data: updated };
  }

  // ========== ADMIN ENDPOINTS ==========

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create user (Admin only)' })
  async create(@Body() createData: any) {
    const user = await this.usersService.create(createData);
    return { success: true, message: 'User created successfully', data: user };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'List all users (Admin only)' })
  async findAll(@Query() query: PaginationDto) {
    const users = await this.usersService.findAll(query);
    return { success: true, data: users };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return { success: true, data: user };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update user (Admin only)' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    const updated = await this.usersService.update(id, updateData);
    return { success: true, message: 'User updated successfully', data: updated };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { success: true, message: 'User deleted successfully' };
  }

  @Patch(':id/password')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Change user password (Admin only)' })
  async changePassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string },
  ) {
    const result = await this.usersService.changePassword(id, body.newPassword);
    return { success: true, message: 'Password updated successfully', data: result };
  }
}
