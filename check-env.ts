// check-env.ts

import * as dotenv from 'dotenv';

// This command loads the .env file from the current directory
dotenv.config();

console.log('--- Running Environment Variable Check ---');

// Attempt to read the DATABASE_URL from the environment
const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  console.log('✅ SUCCESS: The DATABASE_URL was found.');
  console.log('Value:', databaseUrl);
} else {
  console.log('❌ FAILED: The DATABASE_URL was NOT found in process.env.');
  console.log('This means the .env file is not being loaded correctly.');
}

console.log('--- Check Complete ---');