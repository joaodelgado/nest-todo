import { faker } from "@faker-js/faker";
import { NewUser, NewUserData, User, UserData } from "./user.entity";
import * as crypt from '../utils/crypt.util';

// Generators

export async function createRandomNewUser(data?: Partial<NewUserData>, password?: string): Promise<NewUser> {
  const user_data = {
    username: faker.internet.userName(),
    pass_hash: await crypt.hash_password(password || faker.internet.password()),
  };
  Object.assign(user_data, data);

  return new NewUser(user_data);
}

export async function createRandomUser(data?: Partial<UserData>, password?: string): Promise<User> {
  const user_data = {
    id: faker.number.int(),
    username: faker.internet.userName(),
    pass_hash: await crypt.hash_password(password || faker.internet.password()),
  };
  Object.assign(user_data, data);

  return new User(user_data);
}

// Tests

describe('NewUser', () => {
  it('from plain credentials should hash the clear password', async () => {
    // Prepare
    const username = faker.internet.userName();
    const password = faker.internet.password();

    // Execute
    const result = await NewUser.from_clear_credentitals(username, password);

    // Verify
    expect(result.data.username).toBe(username);
    expect(result.data.pass_hash).toBeTruthy();
    expect(result.data.pass_hash).not.toBe(password);
  });

});
