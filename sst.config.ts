import { SSTConfig } from 'sst';
import { Cron, NextjsSite } from 'sst/constructs';
import * as cdk from 'aws-cdk-lib';

const ROOT_DOMAIN_NAME = 'enchantors.com';
const DOMAIN_NAME = `${ROOT_DOMAIN_NAME}`;
const DOMAIN_NAME_ALIAS = `www.${ROOT_DOMAIN_NAME}`;

export default {
    config(_input) {
        return {
            name: 'enchantors',
            region: 'us-east-1',
        };
    },
    stacks(app) {
        app.stack(function Site({ stack }: any) {
            const hostedZone = new cdk.aws_route53.HostedZone(
                stack,
                'HostedZone',
                {
                    zoneName: ROOT_DOMAIN_NAME,
                }
            ) as any;

            const certificate = new cdk.aws_certificatemanager.Certificate(
                stack,
                'Certificate',
                {
                    domainName: DOMAIN_NAME,
                    validation:
                        cdk.aws_certificatemanager.CertificateValidation.fromDns(
                            hostedZone
                        ),
                }
            ) as any;

            const site = new NextjsSite(stack, 'enchantors', {
                customDomain: {
                    domainName: DOMAIN_NAME,
                    domainAlias: DOMAIN_NAME_ALIAS,
                    cdk: {
                        hostedZone,
                        certificate,
                    },
                },
                timeout: '60 seconds',
            });

            new Cron(stack, 'cron_generation', {
                schedule: 'rate(1 hour)',
                job: 'pages/api/cron/cron-generation.handler',
            });

            new Cron(stack, 'cron_email_send', {
                schedule: 'cron(0 17 * * ? *)',
                job: 'pages/api/cron/cron-email.handler',
            });

            stack.addOutputs({
                SiteUrl: site.url,
            });
        });
    },
} satisfies SSTConfig;
