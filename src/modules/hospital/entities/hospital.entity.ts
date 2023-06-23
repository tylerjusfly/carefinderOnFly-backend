import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from '../../../database/custom-base.entity';

@Entity({ name: 'hospitals' })
export class Hospital extends CustomBaseEntity {
  @Column({ type: 'varchar', nullable: false })
  hospitalname: string;

  @Column({ type: 'varchar', nullable: false })
  slugname: string;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({ type: 'varchar', nullable: true })
  contact: string;

  @Column({ type: 'varchar', nullable: true, default: 0 })
  approved: number;
}
