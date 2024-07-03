import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse
) {
    return res.json({ status: 'good', message: 'API is healthy' });
}
