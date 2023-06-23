import { Injectable, PipeTransform } from '@nestjs/common';
import { CreateHospitalDto } from 'src/modules/hospital/dtos/hospital.dto';

@Injectable()
export class StringformatPipe implements PipeTransform {
  transform(value: CreateHospitalDto, _metadata) {
    if (value) {
      value.hospitalname = value.hospitalname
        .toLowerCase()
        .replace(/\s{2,}/g, ' ')
        .trim();
    }

    return value;
  }
}

// [0].toUpperCase() + word.slice(1);
