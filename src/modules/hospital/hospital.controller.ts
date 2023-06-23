import { Body, Controller, Get, Post, Query, Request, UsePipes } from '@nestjs/common';
import { StringformatPipe } from 'src/utils/formatPipe';
import { CreateHospitalDto } from './dtos/hospital.dto';
import { HospitalService } from './hospital.service';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Get('list')
  update(@Query() queryParams, @Request() request) {
    const limit = request.query.hasOwnProperty('limit') ? parseInt(request.query.limit, 10) : 10;
    const page = request.query.hasOwnProperty('page') ? parseInt(request.query.page, 10) : 1;
    return this.hospitalService.listAllHospitals({ page, limit }, queryParams);
  }

  @Post('')
  @UsePipes(new StringformatPipe())
  createHospital(@Body() hospitalData: CreateHospitalDto) {
    return this.hospitalService.saveHospitalData(hospitalData);
  }
}
