import dotenv from 'dotenv';
import { defineConfig } from 'vitest/config';
import envVar from 'env-var';

dotenv.config();

export default defineConfig({
  test: {
	dir: 'tests',
	include: envVar.get("TEST_LOGGER_ONLY").asBool() ? ['logger.test.js'] : ['**/*.test.js'],
  }
})