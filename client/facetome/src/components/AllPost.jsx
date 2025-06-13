import { useState } from "react";
import AddComment from "./AddComment";
import { formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import DeletePost from "./DeletePost";
import ToggleLikePost from "./ToggleLikePost";
import DeleteComment from "./DeleteComment";
import { useUser } from "../provider/UserProvider";
import { useEffect } from "react";
const AllPost = ({
  posts,
  loading,
  onDelete,
  onLikeToggle,
  onCommentAdded,
  onCommentDeleted,
}) => {
  const { getAvatar } = useUser();
  const userId = parseInt(localStorage.getItem("userId"));
  const [visibleComments, setVisibleComments] = useState({});

  useEffect(() => {
    const defaults = {};
    posts.forEach((post) => {
      if (post.comments.length > 0) {
        defaults[post.id] = true;
      }
    });
    setVisibleComments((prev) => ({ ...prev, ...defaults }));
  }, [posts]);

  const toggleCommentForm = (postId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (loading)
    return (
      <div className="flex justify-center p-10 bg-gray-100 w-screen h-screen">
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          className="text-blue-500 text-3xl"
        />
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-y-4 w-screen min-h-screen">
      {posts.length === 0 ? (
        <div className="flex items-center font-bold text-center text-gray-400 h-screen">
          No Posts Yet.
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="rounded-xl text-white w-full sm:w-4/5 md:w-2/3 lg:w-1/2"
          >
            <div className="bg-4 rounded-t-2xl text-white px-3 py-2">
              <div className="flex space-x-2 items-center ">
                <div>
                  <img
                    src={
                      post.author.profilePicture ||
                      getAvatar(post.author.gender)
                    }
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3>{post.author.username}</h3>
                  <h3 className="text-gray-400">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </h3>
                </div>
              </div>
              <h2 className="pl-8">{post.title}</h2>
            </div>

            <div className="bg-2 rounded-b-2xl">
              <div
                className="p-10 border-x-4 w-full bg-white text-black rounded-xl"
                contentEditable={false}
              >
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
                  <p contentEditable={false}>{post.likes.length}</p>
                </div>

                <button
                  onClick={() => toggleCommentForm(post.id)}
                  className="text-sm text-slate-100 bg-1 hover:bg-gray-500 px-3 py-1 rounded"
                >
                  {visibleComments[post.id] ? "Hide Comments" : "Add Comment"}
                </button>
                {post.authorId === userId && (
                  <DeletePost postId={post.id} onDelete={onDelete} />
                )}
              </div>

              {visibleComments[post.id] && (
                <div className="px-4 pb-4">
                  <div className="max-h-56 overflow-y-auto bg-1 rounded p-2 ">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-2 border rounded-xl my-2 text-sm text-gray-300 flex justify-between"
                      >
                        <p>
                          <strong>{comment.author.username}:</strong>{" "}
                          {comment.content}
                          <h3 className="text-gray-400">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </h3>
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
