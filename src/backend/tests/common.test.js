import { getEnabledApis } from "../apis/common.js";
import { assert, it } from "vitest";
import pinoLogger, { nestedKey, pinoTest, testStream } from "../logger.js";

it("Enabled APIs", { timeout: 30000 }, async () => {
	try {
		const enabledApis = await getEnabledApis();
		let count = 0;
		const about = [];
		for await (const service of enabledApis) {
			count++;
			about.push({ title: service.config.title, summary: service.config.documentation.summary });
		}
		pinoLogger.info({ count, about }, "Enabled APIs");
		// await pinoTest.once(testStream, (log) => {
		// 	const contents = log[nestedKey];
		// 	assert.strictEqual(contents.about.length, count, 'Count does not match total amount of enabled APIs');
		// });
	} catch (error) {
		pinoLogger.error(error);
	}
});