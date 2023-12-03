const alias = require("esbuild-plugin-alias");

module.exports = (serverless) => ({
    plugins: [
        alias({
            "yargs/yargs": `${__dirname}/node_modules/@puppeteer/browsers/node_modules/yargs/index.mjs`,
        }),
    ],
});