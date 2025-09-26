import { GoogleAuth } from "google-auth-library";
import { it } from 'vitest';

it("Google Auth Library Test", { timeout: 20000 }, async () => {
	/**
	 * Application Default Credentials (ADC) test. 
	 * Note: This works with `gcloud auth login` but not with `gcloud auth application-default login`. It seems the former persists.
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
		return res.data;
	} catch (error) {
		console.error(error);
	}
});
