const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllPosts = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const follows = await prisma.userFollow.findMany({
      where: {
        OR: [
          { followerId: currentUserId, status: "ACCEPTED" },
          { followingId: currentUserId, status: "ACCEPTED" },
        ],
      },
    });
    const userIds = [currentUserId];

    follows.forEach(f => {
      if (f.followerId !== currentUserId) userIds.push(f.followerId);
      if (f.followingId !== currentUserId) userIds.push(f.followingId);
    });

    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: userIds },
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



exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: { select: { username: true } },
        comments: { include: { author: true } },
        likes: true,
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not Found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Server error while fetching post" });
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

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: { comments: true },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (existingPost.authorId !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to delete this post" });
    }

    await prisma.comment.deleteMany({
      where: { postId: parseInt(id) },
    });

    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Post successfully deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Server error while deleting post" });
  }
};
