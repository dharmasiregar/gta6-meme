import { copyFile, mkdir, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const botRoot = resolve(process.env.MAKEFUN_BOT_DIR ?? '.');
const resultRoot = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
const sourcePost = resolve(botRoot, 'POST.json');
const destinationPost = resolve(resultRoot, 'POST.json');

try {
  await access(sourcePost);
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
    console.error(`Error: missing POST.json at ${sourcePost}`);
    process.exitCode = 1;
  } else {
    console.error(`Error: could not access POST.json at ${sourcePost}: ${(error as Error).message}`);
    process.exitCode = 1;
  }
} 

if (process.exitCode !== 1) {
  try {
    await mkdir(resultRoot, { recursive: true });
    await copyFile(sourcePost, destinationPost);
    console.log(`Copied POST.json to ${destinationPost}`);
  } catch (error) {
    console.error(`Error: could not copy POST.json to ${destinationPost}: ${(error as Error).message}`);
    process.exitCode = 1;
  }
}
