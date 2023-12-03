export default {
	type: "object",
	properties: {
		data: { type: "string" },
		objectKey: { type: "string" },
	},
	required: ["objectKey"]
} as const;
