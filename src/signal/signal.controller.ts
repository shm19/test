import { Controller, Get, Param, Delete } from '@nestjs/common';

import { SignalService } from './signal.service';

@Controller('signals')
export class SignalController {
  constructor(private readonly signalService: SignalService) {}

  @Get()
  findAll() {
    return this.signalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.signalService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.signalService.remove(+id);
  }
}
