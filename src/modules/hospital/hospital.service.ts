import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from './entities/hospital.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateHospitalDto } from './dtos/hospital.dto';
import { convertToSlug } from 'src/utils/utils';
import { PaginationOptionsInterface } from 'src/core/pagination.options';
import { PaginatedResult } from 'src/core/paginate.interface';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,
  ) {}

  async saveHospitalData(data: CreateHospitalDto): Promise<any> {
    try {
      const slugname = convertToSlug(data.hospitalname);
      const existingHospital = await this.hospitalRepository.findOneBy({
        slugname,
      });

      if (existingHospital) {
        return { success: false, message: `Duplicate hospital` };
      }

      /*Else create hospital */
      const hospital = await this.hospitalRepository.save({
        ...data,
        slugname,
      });

      return { success: true, result: hospital };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async listAllHospitals(options: PaginationOptionsInterface, params): Promise<PaginatedResult> {
    const { hospitalName } = params;

    // Connect to database
    const query = this.hospitalRepository.createQueryBuilder('h').select('h.*');

    const page = options.page - 1;

    query.where('h.approved = :status', { status: '0' });

    // Search results for  hospital
    if (hospitalName && hospitalName !== '') {
      query.andWhere(
        new Brackets((qb) => {
          qb.andWhere('LOWER(h.hospitalname) Like :hospitalname', { hospitalname: `%${hospitalName}%` });
        }),
      );
    }

    const hospitals = await query
      .offset(page * options.limit)
      .limit(options.limit)
      .orderBy('h.createdAt', 'DESC')
      .getRawMany();

    const totalCount = await query.getCount();

    return {
      success: true,
      result: hospitals,
      totalPages: Math.ceil(totalCount / options.limit),
      itemsPerPage: options.limit,
      totalItems: totalCount,
      currentPage: options.page,
    };
  }
}
