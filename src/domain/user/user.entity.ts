import * as crypt from '../utils/crypt.util';

export interface NewUserData {
  username: string;
  pass_hash: string;
}

export class NewUser {
  public constructor(public data: NewUserData) { }

  public static async from_clear_credentitals(username: string, password: string): Promise<NewUser> {
    return new NewUser({
      username: username,
      pass_hash: await crypt.hash_password(password),
    })
  }
}

export interface UserData extends NewUserData {
  id: number;
}

export class User extends NewUser {
  public constructor(public data: UserData) {
    super(data);
  }
}
