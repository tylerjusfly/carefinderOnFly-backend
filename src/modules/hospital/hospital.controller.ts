import { Body, Controller, Get, Post, Patch, Query, Param, Request, UsePipes, Response } from '@nestjs/common';
import { StringformatPipe } from 'src/utils/formatPipe';
import { CreateHospitalDto, UpdateHospitalDto } from './dtos/hospital.dto';
import { HospitalService } from './hospital.service';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Get('list')
  listAllHospitals(@Query() queryParams, @Request() request) {
    const limit = request.query.hasOwnProperty('limit') ? parseInt(request.query.limit, 10) : 10;
    const page = request.query.hasOwnProperty('page') ? parseInt(request.query.page, 10) : 1;
    return this.hospitalService.listAllHospitals({ page, limit }, queryParams);
  }

  @Post('')
  @UsePipes(new StringformatPipe())
  createHospital(@Body() hospitalData: CreateHospitalDto) {
    return this.hospitalService.saveHospitalData(hospitalData);
  }

  @Patch('/:id')
  updateHospital(@Param('id') id, @Body() data: UpdateHospitalDto) {
    return this.hospitalService.setStatus(id, data);
  }

  @Get('export')
  async exportHospital(@Request() req, @Response() res) {
    const filename = `hospitals-${Date.now()}.csv`;

    const csv = await this.hospitalService.exportHospitals();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
    res.status(200).send(csv.result);
  }
}
