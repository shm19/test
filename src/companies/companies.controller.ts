/* eslint-disable class-methods-use-this */
import {
  Controller,
  Delete,
  Patch,
  Query,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HasRoles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/role.guard';
import { Role } from '../types/role.enum';
import { CompaniesService } from './companies.service';
import { AddCompanyDto } from './dto/add-company.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SetThresholdAndRangeDto } from './dto/set-threshold-range.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('/')
  findAll(@Request() req, @Query('type') type: string) {
    return this.companiesService.findAll(req, type);
  }

  @HasRoles(Role.SuperAdmin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('/')
  create(@Body() data: AddCompanyDto) {
    return this.companiesService.create(data);
  }

  @HasRoles(Role.SuperAdmin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('/:id/update-status')
  updateStatus(@Param('id') id: string, @Body() data: ChangeStatusDto) {
    return this.companiesService.updateStatus(data, id);
  }

  @HasRoles(Role.SuperAdmin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }

  @HasRoles(Role.SuperAdmin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Patch('/:id')
  update(@Param('id') id: string, @Body() data: UpdateCompanyDto) {
    return this.companiesService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('/:id/upgrade')
  upgrade(@Request() req) {
    return this.companiesService.upgradeCompany(req);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('/:id')
  findOne(@Request() req) {
    return req.query.company;
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Patch('/:id/thresholds-and-range')
  setThresholdsAndRange(@Request() req, @Body() data: SetThresholdAndRangeDto) {
    return this.companiesService.setThresholdsAndRange(req, data);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('/:id/thresholds-and-range')
  getThresholdsAndRange(@Request() req) {
    return this.companiesService.getThresholdsAndRange(req);
  }
}
