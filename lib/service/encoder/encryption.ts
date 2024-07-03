import * as crypto from 'crypto';

export const encrypt = async (text: string) => {
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encodedPlaintext = new TextEncoder().encode(text);

    const secretKey = await crypto.subtle.importKey(
        'raw',
        Buffer.from(process.env.CIPHER_KEY!, 'base64'),
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    );

    const ciphertext = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv,
        },
        secretKey,
        encodedPlaintext
    );

    return {
        encrypted: Buffer.from(ciphertext).toString('base64'),
        iv: Buffer.from(iv).toString('base64'),
    };
};

export const decrypt = async (encrypted: string, iv: string) => {
    const secretKey = await crypto.subtle.importKey(
        'raw',
        Buffer.from(process.env.CIPHER_KEY!, 'base64'),
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    );

    const cleartext = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: Buffer.from(iv, 'base64'),
        },
        secretKey,
        Buffer.from(encrypted, 'base64')
    );

    return new TextDecoder().decode(cleartext);
};
