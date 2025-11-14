import { GoogleAuth } from "google-auth-library";
import { assert, it } from 'vitest';
import pinoLogger, { nestedKey, pinoTest, testStream } from "../logger.js";

it("Google Auth Library Test", { timeout: 30000 }, async () => {
	/**
	 * Application Default Credentials (ADC) test. 
	 * Note: This works with `gcloud auth login` but not with `gcloud auth application-default login`. It seems the former persists. To logout, use `gcloud auth revoke`.
	 * @link {https://github.com/googleapis/google-auth-library-nodejs?tab=readme-ov-file#application-default-credentials}
	 * 
	 * Modified test so that it doesn't require DNS API to be enabled. Cloud Resource Manager API suggested by ChatGPT.
	 */
	const auth = new GoogleAuth({
		scopes: 'https://www.googleapis.com/auth/cloud-platform',
	});
	const projectId = await auth.getProjectId();
	const url = `https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}`;
	// The modern `fetch` and classic `request` APIs are available
	try {
		const res = await auth.fetch(url);
		pinoLogger.info(res.data, "Google Auth Library Test");
		// await pinoTest.once(testStream, (log) => {
		// 	assert.hasAllKeys(Object.keys(log[nestedKey]), ['projectNumber', 'projectId', 'lifecycleState', 'name', 'createTime'], 'Assertion keys failed');
		// });
	} catch (error) {
		pinoLogger.error(error);
	}
});
