import type { AWS } from '@serverless/typescript';

import html_to_pdf from '@functions/html-to-pdf';

const outputBucketName = "${sls:stage}-generated-pdf";

const serverlessConfiguration: AWS = {
  service: 'html-to-pdf-converter',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  resources: {
    Resources: {
      Bucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: outputBucketName,
        },
      },
    },
  },
  provider: {
    deploymentBucket: {
      name: "${sls:stage}-serverless-framework-deploy-bucket",
      maxPreviousDeploymentArtifacts: 3,
    },
    name: 'aws',
    runtime: 'nodejs18.x',
    region: "ap-northeast-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET_NAME: outputBucketName,
      BUCKET_ARN: "${sls:stage}-generated-pdf-bucket"
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["s3:PutObject"],
        Resource: ["${sls:stage}-generated-pdf-bucket"],
      },
    ],
  },
  // import the function via paths
  functions: { html_to_pdf },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      config: "./esbuild.config.js",
    },
  },
};

module.exports = serverlessConfiguration;
