import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Abstract mapped superclass providing a UUID primary key and creation/update
 * timestamps. Entities that extend this class inherit these columns (TypeORM
 * supports column inheritance from abstract parents — see the audit module).
 */
export abstract class TimestampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
