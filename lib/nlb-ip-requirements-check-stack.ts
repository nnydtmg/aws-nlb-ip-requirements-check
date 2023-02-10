import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { CfnOutput } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

export class NlbIpRequirementsCheckStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const vpc = new ec2.Vpc(this, 'nlbVPC', {
      cidr: '10.1.0.0/16',
      maxAzs: 3,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [
        /*{
          cidrMask: 28,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 28,
          name: 'private-web',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },*/
        {
          cidrMask: 28,
          name: 'private-db',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    })
    
    /*const cfnPublicSubnet1 = vpc.publicSubnets[0].node.defaultChild as ec2.CfnSubnet
    cfnPublicSubnet1.addPropertyOverride('CidrBlock', `10.1.0.0/28`)
    */
    // セキュリティグループ
    const securityGroup = new ec2.SecurityGroup(this, 'SampleSecurityGroup', {
      vpc: vpc,
      securityGroupName: 'cdk-vpc-ec2-security-group',
    });

    // (Session Mangerを使うための)IAMロール
    const instanceRole = new iam.Role(this, 'ssmIAMRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonSSMManagedInstanceCore"
        ),
      ],
      description: 'cdk-vpc-ec2-instance-role',
    });

    // EC2インスタンス作成
    const createInstance = (id: string, name: string, subnet: ec2.SubnetSelection) : ec2.Instance => {
      return new ec2.Instance(this, id, {
        vpc,
        vpcSubnets: subnet,
        instanceType: new ec2.InstanceType(this.node.tryGetContext('instanceType')),
        machineImage: ec2.MachineImage.latestAmazonLinux({
          generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        }),
        securityGroup: securityGroup,
        role: instanceRole,
        instanceName: name
      });
    };

    const instance1 = createInstance('SampleInstance1', 'cdk-vpc-ec2-instance1', vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      availabilityZones:['ap-northeast-1a']
    }));
    const instance2 = createInstance('SampleInstance2', 'cdk-vpc-ec2-instance2', vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      availabilityZones:['ap-northeast-1c']
    }));
    const instance3 = createInstance('SampleInstance3', 'cdk-vpc-ec2-instance3', vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      availabilityZones:['ap-northeast-1a']
    }));
    const instance4 = createInstance('SampleInstance4', 'cdk-vpc-ec2-instance4', vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      availabilityZones:['ap-northeast-1c']
    }));
    const instance5 = createInstance('SampleInstance5', 'cdk-vpc-ec2-instance5', vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      availabilityZones:['ap-northeast-1a']
    }));
    const instance6 = createInstance('SampleInstance6', 'cdk-vpc-ec2-instance6', vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      availabilityZones:['ap-northeast-1c']
    }));const instance7 = createInstance('SampleInstance7', 'cdk-vpc-ec2-instance7', vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      availabilityZones:['ap-northeast-1a']
    }));
    const instance8 = createInstance('SampleInstance8', 'cdk-vpc-ec2-instance8', vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      availabilityZones:['ap-northeast-1c']
    }));const instance9 = createInstance('SampleInstance9', 'cdk-vpc-ec2-instance9', vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      availabilityZones:['ap-northeast-1a']
    }));
    const instance10 = createInstance('SampleInstance10', 'cdk-vpc-ec2-instance10', vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      availabilityZones:['ap-northeast-1c']
    }));


     // CloudFormationに出力
     // new CfnOutput(this, 'VPC', { value: vpc.vpcId });
     // new CfnOutput(this, 'PublicSubnet1', { value: vpc.publicSubnets[0].subnetId });
     // new CfnOutput(this, 'Security Group', { value: securityGroup.securityGroupId });
     // new CfnOutput(this, 'EC2Instance1', { value: instance1.instanceId });
  }
}