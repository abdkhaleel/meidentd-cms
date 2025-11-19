import { config } from 'dotenv';
import { resolve } from 'path';
import { exec } from 'child_process';

// Load the .env file from the root directory
config({ path: resolve(process.cwd(), '.env') });

console.log('🌱 Starting the database seed process...');

// Construct the command to run
const command = 'npx prisma db seed';

// Execute the command
const child = exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error executing seed command: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
  }
  console.log(`Stdout: ${stdout}`);
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Seed process completed successfully.');
  } else {
    console.log(` Seed process exited with code ${code}.`);
  }
});