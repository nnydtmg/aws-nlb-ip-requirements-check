import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'

export class NlbIpRequirementsCheckStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const vpc = new ec2.Vpc(this, 'VPC', {
      cidr: '10.1.0.0/16',
      maxAzs: 3,
      subnetConfiguration: [
        {
          cidrMask: 28,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 28,
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    })

    const cfnPublicSubnet1 = vpc.publicSubnets[0].node.defaultChild as ec2.CfnSubnet
    cfnPublicSubnet1.addPropertyOverride('CidrBlock', `10.1.0.0/28`)
    const cfnPublicSubnet2 = vpc.publicSubnets[1].node.defaultChild as ec2.CfnSubnet
    cfnPublicSubnet2.addPropertyOverride('CidrBlock', `10.1.1.0/28`)
    /*
    const cfnPrivateSubnet1 = vpc.privateSubnets[0].node.defaultChild as ec2.CfnSubnet
    cfnPrivateSubnet1.addPropertyOverride('CidrBlock', `10.1.2.0/28`)
    const cfnPrivateSubnet2 = vpc.privateSubnets[1].node.defaultChild as ec2.CfnSubnet
    cfnPrivateSubnet2.addPropertyOverride('CidrBlock', `10.1.3.0/28`)
    */
  }
}