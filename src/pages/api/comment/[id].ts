import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const commentId = req.query.id;

  switch (req.method) {
    case 'DELETE':
      return handleDELETE(commentId, res);
    
    default:
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`,
      );
  }
}

// DELETE /api/comment/:id
async function handleDELETE(commentId: unknown, res: NextApiResponse<any>) {
  const comment = await prisma.comment.delete({
    where: { id: Number(commentId) },
  });
  return res.json(comment);
}


