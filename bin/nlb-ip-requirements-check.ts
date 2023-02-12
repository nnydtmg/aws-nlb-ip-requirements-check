#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NlbIpRequirementsCheckStack } from '../lib/nlb-ip-requirements-check-stack';
import { DefaultStackSynthesizer } from 'aws-cdk-lib';

const app = new cdk.App();
new NlbIpRequirementsCheckStack(app, 'NlbIpRequirementsCheckStack', {
  /*
  synthesizer: new DefaultStackSynthesizer({
    fileAssetsBucketName: 'cdk-assets-nnydtmg-bucket', // bootstrapのバケット名を指定
  }),
  */
  description: 'This is a cdk-nlb-ip-check-stack.', // CloudFormationスタックに説明を追加
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});