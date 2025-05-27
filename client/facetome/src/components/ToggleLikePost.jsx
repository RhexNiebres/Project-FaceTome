import { useState } from "react";
import { toggleLikePost } from "../apiServices/like";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const ToggleLikePost = ({ postId, initialLiked = false, onToggle }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggleLike = async () => {
    setLoading(true);
    setError(null);

    const result = await toggleLikePost(postId);

    setLoading(false);
    if (result.success) {
      const newLiked = result.like?.liked ?? !liked;
      setLiked(newLiked);
      if (onToggle) onToggle(newLiked);
    } else {
      setError(result.error);
    }
  };

  return (
    <div>
      <button onClick={handleToggleLike} disabled={loading}>
        {loading ? (
          <div className="">
            <FontAwesomeIcon
              icon={faCircleNotch}
              spin
              className="text-blue-500 text-3xl"
            />
          </div>
        ) : (
          <>
            {" "}
            <FontAwesomeIcon
              icon={liked ? solidHeart : regularHeart}
              className={liked ? "text-blue-500" : ""}
            />{" "}
          </>
        )}
      </button>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default ToggleLikePost;
