import { useState, useEffect } from "react";
import { getAllUsers } from "../apiRequests/users";
import NavBar from "../components/NavBar";
import FollowButton from "../components/FollowButton";
import FollowRequestResponse from "../components/FollowRequestResponse"; 
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
    <div className="bg-slate-100 min-h-screen">
      <NavBar />
      <h1 className="text-center font-bold p-6 text-xl sm:text-2xl md:text-3xl">
        Find Friends
      </h1>

      {users.length > 0 ? (
        <div className="p-4 flex flex-col items-center">
          <ul className="w-full max-w-xl space-y-4">
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
                  className="p-4 bg-1 w-full rounded font-medium"
                  key={user.id}
                >
                  <div className="text-white flex justify-between items-center gap-4 flex-wrap">
                    <div>
                      <span className="text-sm text-gray-300">{status}</span>
                      <div>{user.username}</div>
                    </div>

                    <div className="shrink-0">
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
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[60vh] w-full">
          <p className="font-bold text-gray-400">No Users Yet.</p>
        </div>
      )}
    </div>
  );
};

export default FindFriendsPage;
