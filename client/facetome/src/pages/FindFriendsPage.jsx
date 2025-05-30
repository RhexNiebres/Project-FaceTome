import { useState, useEffect } from "react";
import { getAllUsers } from "../apiServices/users";
import NavBar from "../components/NavBar";
import FollowButton from "../components/FollowButton";
import FollowRequestResponse from "../components/FollowRequestResponse"; // Adjust path as needed

const FindFriendsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAllUsers();

      if (result.success) {
        setUsers(result.users);
      } else {
        setError(result.error || "Failed to fetch users");
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-4">
      <NavBar />
      <h1 className="text-gray-200 text-center font-bold p-6 text-xl">
        Find Friends
      </h1>
      {users.length > 0 ? (
        <div className="text-gray-200 p-2 flex flex-col items-center h-screen">
          <ul>
            {users.map((user) => {
              let status = "Not Following";

              if (user.isFollowingEachOther) {
                status = "Mutual";
              } else if (user.isFollowing) {
                status = "Following";
              } else if (user.isPendingRequest) {
                status = "Pending";
              } else if (user.hasCTA) {
                status = "Requested";
              } else if (user.canFollow) {
                status = "";
              }

              return (
                <li
                  className="p-4 bg-1 w-96 rounded font-medium mb-3"
                  key={user.id}
                >
                  <div className="text-white flex flex-col gap-2">
                    <span className="text-sm text-gray-300">{status}</span>
                    <span>{user.username}</span>
                    {user.isFollowingEachOther ? null : user.isPendingRequest ? (
                      <FollowRequestResponse requestId={user.followRequestId} />
                    ) : (
                      <FollowButton
                        followingId={user.id}
                        initiallyFollowed={user.isFollowing}
                        isPendingRequest={user.isPendingRequest}
                        hasCTA={user.hasCTA}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p>No Users Found </p>
      )}
    </div>
  );
};

export default FindFriendsPage;
