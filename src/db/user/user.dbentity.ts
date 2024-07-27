import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { NewUser, User } from '../../domain/user/user.entity';

@Entity('users')
export class UserDbEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  username: string;

  @Column()
  pass_hash: string;

  public static from_domain(user: NewUser): UserDbEntity {
    const dbEntity = new UserDbEntity();

    dbEntity.username = user.data.username;
    dbEntity.pass_hash = user.data.pass_hash;

    return dbEntity;
  }

  public to_domain(): User {
    return new User({
      id: this.id,
      username: this.username,
      pass_hash: this.pass_hash,
    });
  }
}
