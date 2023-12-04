import { handlerPath } from "@libs/handler-resolver";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	layers: [
		"arn:aws:lambda:ap-northeast-1:180499926846:layer:dev-chromium:1"
	],
	timeout: 15,
	memorySize: 2048,
	events: [
		{
			http: {
				method: "post",
				path: "pdf",
			},
		},
	],
};
