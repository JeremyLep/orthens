import prisma from "../orm/prisma";

export const createAlert = async (type: string, userId: string, data: any) => {
    switch (type) {
        case 'invitation':
            return createInvitationAlert(userId, data);
        case 'new-follow-up':
            return createFollowUpAlert(userId, data);
        case 'new-message':
            return createMessageAlert(userId, data);
        case 'new-document':
            return createDocumentAlert(userId, data);
        default:
            return null;
    }
}

const createInvitationAlert = async (userId: string, data: any) => {
    return await prisma.alert.create({
        data: {
            type: 'invitation',
            title: `Nouvelle invitation !`,
            message: `${data.professional.name} vous a invité à rejoindre le groupe pour ${data.child.firstname} ${data.child.lastname}.`,
            image: data.professional.image,
            link: `${process.env.NEXTAUTH_URL}/invitations`,
            linkText: 'Voir l\'invitation',
            user: {
                connect: {
                    id: userId
                }
            },
        }
    });   
}

const createFollowUpAlert = async (userId: string, data: any) => {
    return await prisma.alert.create({
        data: {
            type: 'follow-up',
            title: `Nouveau suivi !`,
            message: `${data.professional.name} a ajouté un nouveau suivi pour ${data.child.firstName} ${data.child.lastName}.`,
            image: data.professional.image,
            link: `${process.env.NEXTAUTH_URL}/students/${data.child.id}`,
            linkText: 'Voir le suivi',
            user: {
                connect: {
                    id: userId
                }
            },
        }
    });   
}

const createMessageAlert = async (userId: string, data: any) => {
    return await prisma.alert.create({
        data: {
            type: 'message',
            title: `Nouveau message !`,
            message: `${data.professional.name} vous a envoyé un message.`,
            image: data.professional.image,
            link: `${process.env.NEXTAUTH_URL}/students/${data.child.id}?tab=conversation`,
            linkText: 'Voir le message',
            user: {
                connect: {
                    id: userId
                }
            },
        }
    });   
}

const createDocumentAlert = async (userId: string, data: any) => {
    return await prisma.alert.create({
        data: {
            type: 'document',
            title: `Nouveau document !`,
            message: `${data.professional.name} a ajouté un nouveau document pour ${data.child.firstName} ${data.child.lastName}.`,
            image: data.professional.image,
            link: `${process.env.NEXTAUTH_URL}/students/${data.child.id}?tab=document`,
            linkText: 'Voir le document',
            user: {
                connect: {
                    id: userId
                }
            },
        }
    });   
}