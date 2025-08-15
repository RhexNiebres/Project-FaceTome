import { useState } from "react";
import {
  acceptFollowRequest,
  rejectFollowRequest,
} from "../apiRequests/followers";

const FollowRequestResponse = ({ requestId, userId, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const handleAccept = async () => {
    setLoading(true);
    setStatus(null);
    const result = await acceptFollowRequest(requestId);
    setLoading(false);

    if (result.success) {
      setStatus("accepted");
      if (onStatusChange) {
        onStatusChange(userId, {
          isFollowing: true,
          isPendingRequest: false,
          isFollowingEachOther: true,
        });
      }
    } else {
      setStatus("error");
      setError(result.error);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    setStatus(null);
    const result = await rejectFollowRequest(requestId);
    setLoading(false);

    if (result.success) {
      setStatus("rejected");
      if (onStatusChange) {
        onStatusChange(userId, {
          isPendingRequest: false,
          followRequestId: null,
        });
      }
    } else {
      setStatus("error");
      setError(result.error);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {status === "accepted" && (
        <span className="text-green-600 font-medium">Accepted</span>
      )}
      {status === "rejected" && (
        <span className="text-red-600 font-medium">Rejected</span>
      )}
      {status === "error" && (
        <span className="text-red-500 font-medium">Error: {error}</span>
      )}

      {!status && (
        <>
          <button
            onClick={handleAccept}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded disabled:opacity-60"
          >
            {loading ? "Accepting..." : "Accept"}
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded disabled:opacity-60"
          >
            {loading ? "Rejecting..." : "Reject"}
          </button>
        </>
      )}
    </div>
  );
};

export default FollowRequestResponse;
