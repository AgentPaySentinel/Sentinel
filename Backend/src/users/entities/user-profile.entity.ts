import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { TimestampedEntity } from '../../common/entities/base.entity';
import { User } from '../../auth/entities/user.entity';

/**
 * Developer-facing profile and preferences, kept separate from the auth
 * {@link User} (which only holds identity/credential concerns) so the two can
 * evolve independently.
 */
@Entity('user_profiles')
export class UserProfile extends TimestampedEntity {
  @Column({ unique: true })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  displayName?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  /** Free-form UI/notification preferences. */
  @Column({ type: 'jsonb', nullable: true })
  preferences?: Record<string, any>;

  /** Developer-facing settings (default network, signing options, etc.). */
  @Column({ type: 'jsonb', nullable: true })
  developerSettings?: Record<string, any>;
}
