import { GoogleAuth } from "google-auth-library";
import { it } from 'vitest';

it.skipIf(!process.env.GITHUB_ACTIONS)("Google Auth Library Test", async () => {
	/**
	 * Application Default Credentials (ADC) test.
	 * @link {https://github.com/googleapis/google-auth-library-nodejs?tab=readme-ov-file#application-default-credentials}
	 */
	const auth = new GoogleAuth({
	scopes: 'https://www.googleapis.com/auth/cloud-platform'
	});
	const projectId = await auth.getProjectId();
	const url = `https://dns.googleapis.com/dns/v1/projects/${projectId}`;
	// The modern `fetch` and classic `request` APIs are available
	try {
		const res = await auth.fetch(url);
		console.log(res.data);
	} catch (error) {
		console.error(error);
	}
});
