import { assert, it } from 'vitest';
import pinoLogger, { nestedKey, pinoTest, testStream } from "../logger.js";

const isDebug = 'VSCODE_INSPECTOR_OPTIONS' in process.env;
it("Logger Test", { timeout: isDebug ? 0 : undefined }, async () => {
	pinoLogger.info({ test: 'testing logger'}, "Info");
	// await pinoTest.once(testStream, { test: 'testing logger'});
	pinoLogger.error(new Error("Test error"), "Error");
	// await pinoTest.once(testStream, (log) => assert.ifError(log[nestedKey].err));
});