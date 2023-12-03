import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import schema from "./schema";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client();

const pdf: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event,
) => {
	const requestData = event.body;
	const objectKey = requestData.objectKey;
	const browser = await getPuppeteer();
	const page = await browser.newPage();
	await page.setViewport({
		width: 2480,
		height: 3508,
	});

	try {
		await page.setContent(requestData.data);
		const pdf = await page.pdf();
		const command = new PutObjectCommand(
			{
				Bucket: process.env.BUCKET_NAME,
				Key: objectKey,
				Body: pdf,
			},
		);
		
		await client.send(command);

		return {
			statusCode: 200,
			body: objectKey,
		};
	} finally {
		await browser.close();
	}
};

const getPuppeteer = async () => {
	const chromium = require("@sparticuz/chromium");
	const puppeteer = require("puppeteer-core");
	await chromium.font(
		"https://raw.githack.com/minoryorg/Noto-Sans-CJK-JP/master/fonts/NotoSansCJKjp-Regular.ttf",
	);
	return puppeteer.launch({
		executablePath: await chromium.executablePath('/opt/nodejs/node_modules/@sparticuz/chromium/bin'),
		args: chromium.args,
		pipe: true,
		headless: chromium.headless,
		defaultViewport: chromium.defaultViewport,
	});
};
export const main = pdf;
