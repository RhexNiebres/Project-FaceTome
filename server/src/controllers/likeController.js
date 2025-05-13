const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.toggleLikePost = async (req, res) => {
  const userId = req.user.id;
  const postId = parseInt(req.params.postId);

  try {
     const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      
      return res.status(200).json({ message: "Post unliked" });
    } else {
      const like = await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      return res.status(201).json({ message: "Post liked", like });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error while toggling post" });
  }
};

