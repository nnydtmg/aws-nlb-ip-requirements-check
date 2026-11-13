import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as NlbIpRequirementsCheck from '../lib/nlb-ip-requirements-check-stack';

// スタックは AZ 名でサブネットを選ぶため、ダミーのアカウントに AZ のコンテキストを与えて合成する
const account = '123456789012';
const region = 'ap-northeast-1';
const app = new cdk.App({
  context: {
    instanceType: 't2.micro',
    [`availability-zones:account=${account}:region=${region}`]: [
      'ap-northeast-1a',
      'ap-northeast-1c',
      'ap-northeast-1d',
    ],
  },
});
const stack = new NlbIpRequirementsCheck.NlbIpRequirementsCheckStack(app, 'MyTestStack', {
  env: { account, region },
});
const template = Template.fromStack(stack);

test('隔離サブネットのみの VPC が作成されること', () => {
  template.hasResourceProperties('AWS::EC2::VPC', { CidrBlock: '10.1.0.0/16' });
  template.resourceCountIs('AWS::EC2::Subnet', 3);
  template.resourceCountIs('AWS::EC2::InternetGateway', 0);
  template.resourceCountIs('AWS::EC2::NatGateway', 0);
});

test('EC2 インスタンスが 10 台作成されること', () => {
  template.resourceCountIs('AWS::EC2::Instance', 10);
});

test('Amazon Linux 2023 の AMI を使うこと', () => {
  const params = template.toJSON().Parameters ?? {};
  const amiDefaults = Object.values(params).map((p: any) => String(p.Default));
  expect(amiDefaults.some((d) => d.includes('al2023-ami'))).toBe(true);
  expect(amiDefaults.some((d) => d.includes('amzn2-ami'))).toBe(false);
});

test('セキュリティグループにインバウンドルールがないこと', () => {
  const sgs = template.findResources('AWS::EC2::SecurityGroup');
  for (const sg of Object.values(sgs)) {
    expect((sg as any).Properties.SecurityGroupIngress).toBeUndefined();
  }
});
