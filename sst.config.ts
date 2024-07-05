import { SSTConfig } from 'sst';
import { NextjsSite } from 'sst/constructs';
import * as cdk from 'aws-cdk-lib';

const ROOT_DOMAIN_NAME = 'orthens.fr';
const DOMAIN_NAME = `${ROOT_DOMAIN_NAME}`;
const DOMAIN_NAME_ALIAS = `www.${ROOT_DOMAIN_NAME}`;

export default {
    config(_input) {
        return {
            name: 'orthens',
            region: 'us-east-1',
            profile: 'orthens',
        };
    },
    stacks(app) {
        app.stack(function Site({ stack }: any) {
            let hostedZone: any;
            
            hostedZone = cdk.aws_route53.HostedZone.fromLookup(
                stack,
                'ExistingHostedZone',
                {
                    domainName: ROOT_DOMAIN_NAME,
                }
            );

            if (!hostedZone?.hostedZoneId) {
                hostedZone = new cdk.aws_route53.HostedZone(
                    stack,
                    'HostedZone',
                    {
                        zoneName: ROOT_DOMAIN_NAME,
                    }
                );
            }

            const certificate = new cdk.aws_certificatemanager.Certificate(
                stack,
                'Certificate',
                {
                    domainName: DOMAIN_NAME,
                    validation:
                        cdk.aws_certificatemanager.CertificateValidation.fromDns(
                            hostedZone
                        ),
                },
            ) as any;

            const site = new NextjsSite(stack, 'orthens', {
                customDomain: {
                    domainName: DOMAIN_NAME,
                    //domainAlias: DOMAIN_NAME_ALIAS,
                    cdk: {
                        hostedZone,
                        certificate,
                    },
                },
                timeout: '60 seconds',
            });

            stack.addOutputs({
                SiteUrl: site.url,
            });
        });
    },
} satisfies SSTConfig;
