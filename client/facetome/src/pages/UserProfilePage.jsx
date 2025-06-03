import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import NavBar from "../components/NavBar";
import UserPost from "../components/UserPosts";
import UserProfileForm from "../components/UserProfileForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { getAllPostsForCurrentUser } from "../apiServices/posts";

const UserProfilePage = () => {
  const { user, error, getAvatar } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getAllPostsForCurrentUser();
      if (result.success) {
        setPosts(result.posts);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

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
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  };

  const handleCommentDeleted = (postId, commentId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter(
                (comment) => comment.id !== commentId
              ),
            }
          : post
      )
    );
  };

  if (!user && !error)
    return (
      <div className="flex justify-center items-center p-10 bg-4 h-screen">
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          className="text-blue-500 text-3xl"
        />
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="overflow-hidden">
      <NavBar />
      <div className=" min-h-screen min-w-screen bg-4">
        <div className="flex justify-center">
          <UserProfileForm user={user} getAvatar={getAvatar} />

          <UserPost
            posts={posts}
            loading={loading}
            onDelete={handlePostDeleted}
            onLikeToggle={handleLikeToggle}
            onCommentAdded={handleCommentAdded}
            onCommentDeleted={handleCommentDeleted}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
