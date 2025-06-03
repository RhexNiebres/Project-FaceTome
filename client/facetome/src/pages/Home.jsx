import { useState, useEffect } from "react";
import { getAllPosts } from "../apiServices/posts";
import AllPost from "../components/AllPost";
import CreatePost from "../components/CreatePost";
import NavBar from "../components/NavBar";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getAllPosts();

      if (result.success) {
        setPosts(result.posts);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handlePostCreated = async () => {
    const result = await getAllPosts();
    if (result.success) {
      setPosts(result.posts);
    }
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts((prev) => prev.filter((post) => post.id !== deletedPostId));
  };

  const handleLikeToggle = (postId, newLiked) => {
    const userId = parseInt(localStorage.getItem("userId"));

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          let updatedLikes;
          if (newLiked) {
            updatedLikes = [...post.likes, { userId }];
          } else {
            updatedLikes = post.likes.filter((like) => like.userId !== userId);
          }
          return { ...post, likes: updatedLikes };
        }
        return post;
      })
    );
  };
  const handleCommentAdded = (postId, newComment) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  };
  const handleCommentDeleted = (postId, commentId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter(
              (comment) => comment.id !== commentId
            ),
          };
        }
        return post;
      })
    );
  };

  return (
    <div className="flex flex-col bg-4 justify-center ">
      <NavBar />

      <div className="flex justify-center">
        <CreatePost onPostCreated={handlePostCreated} />
      </div>
      <div className="flex items-center p-16">
        <AllPost
          posts={posts}
          loading={loading}
          onDelete={handlePostDeleted}
          onLikeToggle={handleLikeToggle}
          onCommentAdded={handleCommentAdded}
          onCommentDeleted={handleCommentDeleted}
        />
      </div>
    </div>
  );
};

export default Home;
