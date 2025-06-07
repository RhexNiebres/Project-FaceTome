import { useState, useEffect } from "react";
import { getAllUsers } from "../apiServices/users";
import NavBar from "../components/NavBar";
import FollowButton from "../components/FollowButton";
import FollowRequestResponse from "../components/FollowRequestResponse"; // Adjust path as needed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
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
  const handleUserStatus = (userId, updates) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  };
  if (loading)
    return (
      <div className="flex justify-center items-center p-10 bg-4 h-screen">
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          className="text-blue-500 text-3xl"
        />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-slate-100">
      <NavBar />
      <h1 className="text-4 text-center font-bold p-6 text-xl">Find Friends</h1>
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
                  <div className="text-white flex justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-300">{status}</span>
                      <span>{user.username}</span>
                    </div>

                    {user.isFollowingEachOther ? null : user.isPendingRequest ? (
                      <FollowRequestResponse
                        requestId={user.followRequestId}
                        userId={user.id}
                        onStatusChange={handleUserStatus}
                      />
                    ) : (
                      <FollowButton
                        followingId={user.id}
                        initiallyFollowed={user.isFollowing}
                        isPendingRequest={user.isPendingRequest}
                        hasCTA={user.hasCTA}
                        onStatusChange={handleUserStatus}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen w-full ">
          <p className="font-bold text-gray-400">No Users Yet.</p>
        </div>
      )}
    </div>
  );
};

export default FindFriendsPage;
