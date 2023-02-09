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
    const cfnPublicSubnet2 = vpc.publicSubnets[1].node.defaultChild as ec2.CfnSubnet
    cfnPublicSubnet2.addPropertyOverride('CidrBlock', `10.1.1.0/28`)
    const cfnPublicSubnet3 = vpc.publicSubnets[2].node.defaultChild as ec2.CfnSubnet
    cfnPublicSubnet3.addPropertyOverride('CidrBlock', `10.1.2.0/28`)
    */
    /*
    const cfnPrivateSubnet1 = vpc.privateSubnets[0].node.defaultChild as ec2.CfnSubnet
    cfnPrivateSubnet1.addPropertyOverride('CidrBlock', `10.1.2.0/28`)
    const cfnPrivateSubnet2 = vpc.privateSubnets[1].node.defaultChild as ec2.CfnSubnet
    cfnPrivateSubnet2.addPropertyOverride('CidrBlock', `10.1.3.0/28`)
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
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED
    }));
    const instance2 = createInstance('SampleInstance2', 'cdk-vpc-ec2-instance2', vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED
    }));


     // CloudFormationに出力
     // new CfnOutput(this, 'S3', { value: bucket.bucketName });
     new CfnOutput(this, 'VPC', { value: vpc.vpcId });
     // new CfnOutput(this, 'PublicSubnet1', { value: vpc.publicSubnets[0].subnetId });
     // new CfnOutput(this, 'PublicSubnet2', { value: vpc.publicSubnets[1].subnetId });
     // new CfnOutput(this, 'PublicSubnet3', { value: vpc.publicSubnets[2].subnetId });
     // new CfnOutput(this, 'PrivateSubnet1', { value: vpc.privateSubnets[0].subnetId });
     // new CfnOutput(this, 'PrivateSubnet2', { value: vpc.privateSubnets[1].subnetId });
     // new CfnOutput(this, 'Security Group', { value: securityGroup.securityGroupId });
     // new CfnOutput(this, 'EC2Instance1', { value: instance1.instanceId });
     // new CfnOutput(this, 'EC2Instance2', { value: instance2.instanceId });
  }
}