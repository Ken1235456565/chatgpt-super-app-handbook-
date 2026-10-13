// Prints a bcrypt hash for ADMIN_PASSWORD_HASH. Usage: pnpm guestbook:hash-password
import bcrypt from 'bcryptjs';
import { createInterface } from 'node:readline/promises';

const rl = createInterface({ input: process.stdin, output: process.stdout });
const password = await rl.question('Administrator password (at least 12 characters): ');
rl.close();

if (password.length < 12) {
  console.error('Password must be at least 12 characters.');
  process.exit(1);
}

console.log(`\nADMIN_PASSWORD_HASH=${await bcrypt.hash(password, 12)}`);
