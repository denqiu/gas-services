import { GoogleAuth } from "google-auth-library";
import { ServiceUsageClient } from "@google-cloud/service-usage";


async function getEnabledApis() {
	// const auth = new GoogleAuth({
	// 	scopes: 'https://www.googleapis.com/auth/cloud-platform',
	// });
	// const projectId = await auth.getProjectId();

	// const url = `https://serviceusage.googleapis.com/v1/projects/${projectId}/services?filter=state:ENABLED`;
	// const res = await auth.fetch(url);
	// const { services } = res.data;
	// const about = services.map(service => ({ title: service.config.title, summary: service.config.documentation.summary }));
	// return { count: about.length, about, services };
	
	const client = new ServiceUsageClient();
	const projectId = await client.getProjectId();
	return client.listServicesAsync({
		parent: `projects/${projectId}`,
		filter: 'state:ENABLED',
	});

}

export {
	getEnabledApis
};