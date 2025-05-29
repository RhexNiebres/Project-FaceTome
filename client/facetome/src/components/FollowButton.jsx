import { useState } from "react";
import { sendFollowRequest, cancelFollow } from "../apiServices/followers";

const FollowButton = ({ followingId, initiallyFollowed = false }) => {
  const [followed, setFollowed] = useState(initiallyFollowed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggleFollow = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = followed
        ? await cancelFollow(followingId)
        : await sendFollowRequest(followingId);

      if (result.success) {
        setFollowed(!followed);
      } else {
        setError(result.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Network error or server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <button
        onClick={handleToggleFollow}
        disabled={loading}
        aria-pressed={followed}
        aria-busy={loading}
        className={`px-4 py-2 rounded-md text-white transition-all duration-200
          ${
            loading
              ? "bg-blue-400 cursor-wait"
              : followed
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {loading ? (followed ? "Unfollowing..." : "Following...") : followed ? "Cancel" : "Follow"}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FollowButton;
