// Generators

import { createRandomNewUser } from "../../domain/user/user.entity.spec";
import { Repository } from "typeorm";
import { UserDbEntity } from "./user.dbentity";
import { NewUserData, User } from "src/domain/user/user.entity";

export async function savedRandomUser(repository: Repository<UserDbEntity>, data?: Partial<NewUserData>): Promise<User> {
  const user = await createRandomNewUser(data);
  const db_user = await repository.save(UserDbEntity.from_domain(user));
  return db_user.to_domain();
}
