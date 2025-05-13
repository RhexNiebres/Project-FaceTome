const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllPosts = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { authorId: currentUserId }, 
          {
            authorId: {
              in: await prisma.userFollow.findMany({
                where: {
                  followerId: currentUserId,
                  status: Prisma.FollowRequestStatus.ACCEPTED,
                },
                select: {
                  followingId: true, 
                },
              }).then((follows) => follows.map((follow) => follow.followingId)), 
            },
          },
        ],
      },
      include: {
        author: { select: { username: true } },
        comments: { include: { author: true } },
        likes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Server error while fetching posts" });
  }
};


exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;

    if (!title || !content || !authorId) {
      return res
        .status(400)
        .json({ error: "Title, content and user are required" });
    }
    
    const existingPost = await prisma.post.findFirst({
      where: {
        title,
      },
    });

    if (existingPost) {
      return res.status(400).json({
        error: `A post titled "${title}" already exists. Please use a different title.`,
      });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Server error while creating post" });
  }
};


exports.deletePost = async (req, res) => {//only delete if author and admin
  try {
    const postId = parseInt(req.params.id);

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { comments: true },
    });

    if (existingPost.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });
    }

    await prisma.comment.deleteMany({
      where: { postId },
    });

    await prisma.post.delete({
      where: { id: postId },
    });

    res.json({ message: "Post successfully deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Server error while deleting post" });
  }
};
