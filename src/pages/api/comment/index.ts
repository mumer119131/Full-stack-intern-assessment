
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const { comment, commentUserEmail, id } = req.body;
    // get authorId using commentUserEmail
    const user = await prisma.user.findUnique({
        where: { email: commentUserEmail },
    });
    if (user === null) {
        return res.status(400).json({ message: `User not found SignUp for ${commentUserEmail} first` });
    }
    const result = await prisma.comment.create({
        data: {
            content: comment,
            author: { connect: { email: commentUserEmail } },
            post: { connect: { id: id } },
        },
    });
    return res.status(201).json(result);

}

