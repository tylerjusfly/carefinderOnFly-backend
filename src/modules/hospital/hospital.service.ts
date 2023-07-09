import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from './entities/hospital.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateHospitalDto, UpdateHospitalDto } from './dtos/hospital.dto';
import { convertToSlug } from 'src/utils/utils';
import { PaginationOptionsInterface } from 'src/core/pagination.options';
import { PaginatedResult } from 'src/core/paginate.interface';
import { IResponse, IResponseWithHospital } from 'src/interfaces/Iresponse';
import { ParseToCSV } from '../../utils/parseToCsv';

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

    query.where('h.approved = :status', { status: '1' });

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

  async setStatus(id: number, data: UpdateHospitalDto): Promise<IResponseWithHospital> {
    try {
      const { approved } = data;

      if (!id) {
        return { success: false, message: `hospital id is required` };
      }

      const hospital = await this.hospitalRepository.findOneBy({ id: id });

      if (!hospital) {
        return { success: false, message: `hospital is not found` };
      }

      let status = 0;

      // If hospital is found
      if (approved && approved !== '') {
        switch (approved) {
          case 'approved':
            status = 1;
            break;

          case 'rejected':
          default:
            status = 0;
            break;
        }
      }

      // save data to database
      const _rs = await this.hospitalRepository
        .createQueryBuilder()
        .update(Hospital)
        .set({ approved: status })
        .where('id = :id', { id: id })
        .execute();

      const newhospital = await this.hospitalRepository.findOneBy({ id: id });

      return { success: true, result: newhospital };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async exportHospitals(): Promise<IResponse> {
    try {
      let hospitals = await this.hospitalRepository.find();

      const formattedHospitals = hospitals.map((hospital) => {
        return {
          hospitalName: hospital.hospitalname,
          phone: hospital.contact,
          status: hospital.approved == 1 ? 'approved' : 'unapproved',
          location: hospital.location,
        };
      });

      const result = await ParseToCSV(formattedHospitals);

      return { success: true, message: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
