import { useState } from "react";
import AddComment from "./AddComment";
import { formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import DeletePost from "./DeletePost";
import ToggleLikePost from "./ToggleLikePost";
import DeleteComment from "./DeleteComment";
import { useUser } from "../context/UserContext";

const AllPost = ({
  posts,
  loading,
  onDelete,
  onLikeToggle,
  onCommentAdded,
  onCommentDeleted,
}) => {
  const { user, getAvatar } = useUser();
  const userId = parseInt(localStorage.getItem("userId"));
  const [visibleComments, setVisibleComments] = useState({});

  const toggleCommentForm = (postId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (loading)
    return (
      <div className="flex justify-center p-10 bg-4 h-screen">
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          className="text-blue-500 text-3xl"
        />
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-y-4 w-screen h-screen">
      {posts.length === 0 ? (
        <div className="flex items-center font-bold text-center text-gray-200 h-screen">
          No posts Yet.
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="p-4 rounded-xl text-white w-1/2">
            <div className="bg-1 rounded-t text-white px-3 py-2">
              <div className="px-9">
                <img
                  src={
                    post.author.profilePicture || getAvatar(post.author.gender)
                  }
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />

                <h3>{post.author.username}</h3>
                <h3 className="text-gray-400">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </h3>
              </div>
              <h2 className="px-">{post.title}</h2>
            </div>

            <div className="bg-2 rounded-b">
              <div className="p-5 w-full bg-white text-black">
                {post.content}
              </div>

              <div className="flex justify-around items-center px-4 py-2">
                <div className="flex gap-2 hover:bg-1 p-2 rounded">
                  <ToggleLikePost
                    postId={post.id}
                    initialLiked={post.likes.some(
                      (like) => like.userId === userId
                    )}
                    onToggle={(newLiked) => onLikeToggle(post.id, newLiked)}
                  />
                  <p>{post.likes.length}</p>
                </div>

                <button
                  onClick={() => toggleCommentForm(post.id)}
                  className="text-sm text-gray-200 hover:bg-1 p-2 rounded"
                >
                  {visibleComments[post.id] ? "Hide Comments" : "Comment"}
                </button>
                <DeletePost postId={post.id} onDelete={onDelete} />
              </div>

              {visibleComments[post.id] && (
                <div className="px-8 pb-4">
                  <div className="mt-2 max-h-28 overflow-y-auto bg-1 rounded p-2 ">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-2 border-b text-sm text-gray-300 flex justify-between"
                      >
                        <p>
                          <strong>{comment.author.username}:</strong>{" "}
                          {comment.content}
                        </p>
                        {comment.author.id === userId && (
                          <DeleteComment
                            commentId={comment.id}
                            onDelete={() =>
                              onCommentDeleted(post.id, comment.id)
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <AddComment
                    postId={post.id}
                    onCommentAdded={(comment) =>
                      onCommentAdded(post.id, comment)
                    }
                  />
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AllPost;
