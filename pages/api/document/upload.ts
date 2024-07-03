
import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import * as formidable from 'formidable-serverless';
import * as fs from 'fs';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Conversation, ConversationMessage, FollowUpMessage, Relation } from '@prisma/client';
import { createAlert } from 'lib/service/alert/createAlert';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ status: 401, error: 'Unauthorized' });
    }

    try {
        const { type, id } = req.query;

        const { entity, field, folder } = await getEntity(session, type as string, id as string);

        const form = new formidable.IncomingForm();
        const files = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);

                let filesFormatted = [];

                for (const key in files) {
                    if (Object.prototype.hasOwnProperty.call(files, key)) {
                        const file = files[key] as formidable.File;
                        filesFormatted.push(file);
                    }
                }

                resolve(filesFormatted);
            });
        });

        const s3 = new S3Client({
            credentials: {
                accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            },
            region: process.env.AWS_S3_REGION,
        });

        let s3UploadResults = [];

        if (files) {
            const s3UploadPromises = (files as any).map((file) => {
                const fileStream = fs.createReadStream(file.path);
                const upload = new Upload({
                    client: s3,
                    params: {
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: `${type}/${folder}/${session.user.id}/${Date.now()}_${
                            file.name.replace(/ /g, '_')
                        }`,
                        Body: fileStream,
                        ContentType: file.type,
                        ACL: 'public-read',
                    },
                });

                return upload.done();
            });

            s3UploadResults = await Promise.all(s3UploadPromises);
        }

        const filesCreated = await prisma.file.createMany({
            data: s3UploadResults.map((upload, index) => {
                if (entity) {
                    return {
                        url: upload.Location,
                        name: files[index].name,
                        size: parseInt(files[index].size),
                        extension: files[index].type,
                        createdById: session.user.id,
                        [field]: entity.id
                    };
                }

                return {
                    url: upload.Location,
                    name: files[index].name,
                    size: parseInt(files[index].size),
                    extension: files[index].type,
                    createdById: session.user.id,
                };
            }),
        });

        if (filesCreated.count === 0) {
            return res.status(200).json({ status: 200, data: entity });
        }

        const {entity: entityWithFiles} = await getEntity(session, type as string, id as string);
        let file = null;

        if (type === 'relation') {
            const user = (entity as any).users.find((user) => user.id === session.user.id);

            for (let index = 0; index < (entity as any).users.length; index++) {
                const target = (entity as any).users[index];

                if (target.id === session.user.id) {
                    continue;
                }

                await createAlert('new-document', target.id, {professional: user, child: (entity as any).child})
            }
        }

        if (!entityWithFiles) {
            file = await prisma.file.findFirst({
                where: {
                    createdBy: {
                        id: session.user.id,
                    },
                },
                orderBy: {
                  createdAt: 'desc',
                },
                take: 1,
            });
        }

        return res.status(200).json({ status: 200, data: entityWithFiles ?? file });
    } catch (error) {
        console.error('Error uploading file:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}

const getEntity = async (session: any, type: string, id: string) => {
    let entity: Relation | ConversationMessage | FollowUpMessage | null = null;
    let field = null;
    let folder = null;

    switch (type) {
        case 'relation':
            entity = await prisma.relation.findUnique({
                where: {
                    id: id as string,
                    users: {
                        some: {
                            id: session.user.id,
                        },
                    },
                },
                include: {
                    child: true,
                    users: true,
                    files: {
                        orderBy: {
                            createdAt: 'desc',
                        }
                    }
                },
            });
            field = 'relationId';
            folder = entity.id;
            break;
        case 'conversation':
            entity = await prisma.conversationMessage.findUnique({
                where: {
                    id: id as string,
                    conversation: {
                        relation: {
                            users: {
                                some: {
                                    id: session.user.id,
                                },
                            },
                        },
                    }
                },
                include: {
                    createdBy: true,
                    files: {
                        orderBy: {
                            createdAt: 'desc',
                        }
                    }
                },
            });
            field = 'conversationMessageId';
            folder = entity.conversationId;
            break;
        case 'follow-up':
            entity = await prisma.followUpMessage.findUnique({
                where: {
                    id: id as string,
                    createdBy: {
                        id: session.user.id,
                    },
                },
                include: {
                    createdBy: true,
                    files: {
                        orderBy: {
                            createdAt: 'desc',
                        }
                    }
                }
            });
            field = 'followUpMessageId';
            folder = entity.id;
            break;
        case 'user':
            entity = null;
            field = null;
            folder = session.user.id;
        default:
            break;
    }

    return { entity, field, folder };
}