import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hash_password(clear_pass: string): Promise<string> {
  return bcrypt.hash(clear_pass, SALT_ROUNDS);
}

export async function matches(
  clear_pass: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(clear_pass, hash);
}

