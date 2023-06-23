import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from './database/custom-base.entity';

@Entity({ name: 'apikey' })
export class ApiKeyUser extends CustomBaseEntity {
  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  apikey: string;
}
