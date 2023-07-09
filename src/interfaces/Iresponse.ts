import { Hospital } from 'src/modules/hospital/entities/hospital.entity';

export interface IResponse {
  success: boolean;
  message?: string;
  result?: any;
}

export interface IResponseWithHospital extends Omit<IResponse, 'result'> {
  result?: Hospital;
}
