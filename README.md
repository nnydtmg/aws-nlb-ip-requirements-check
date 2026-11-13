# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## 補足

* スタックは AZ 名（`ap-northeast-1a` / `ap-northeast-1c`）でサブネットを選ぶため、環境非依存では合成できません。
  `cdk synth` / `cdk deploy` は、ap-northeast-1 を対象とした AWS 認証情報がある状態で実行してください。
* EC2 の AMI は Amazon Linux 2023 の最新版です（Amazon Linux 2 はサポートが終了しています）。
