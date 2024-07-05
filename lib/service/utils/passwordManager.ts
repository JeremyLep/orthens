import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function encodePassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
}

export async function decodePassword(password: string, hash: string): Promise<boolean> {
  const match = await bcrypt.compare(password, hash);
  return match;
}