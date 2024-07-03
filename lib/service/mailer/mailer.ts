import axios from 'axios';

export const sendMail = async (
    to: { email: string; name?: string },
    templateId: number,
    params: object,
) => {
    return await axios.post(
        `${process.env.BREVO_API_HOST}/smtp/email`,
        {
            to: [to],
            templateId: templateId,
            params: params,
            bcc: [{
                email: process.env.BREVO_BCC,
            }]
        },
        {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
            },
        }
    ).then((response) => {
        console.log('Email sent:', response.data);
        return response.data;
    }).catch((error) => {
        console.log('Error sending email:', error);
        throw error;
    });
};
