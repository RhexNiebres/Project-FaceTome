import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { getUserById } from "../apiServices/users";
import { updateUser } from "../apiServices/users";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newGender, setNewGender] = useState("");
  const [editError, setEditError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("User not found in localStorage.");
      return;
    }

    getUserById(userId).then((result) => {
      if (result.success) {
        setUserData(result.user);
        setNewUsername(result.user.username);
        setNewEmail(result.user.email);
        setNewGender(result.user.gender || "");
      } else {
        setError(result.error);
      }
    });
  }, [userId]);

  const getAvatar = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "./male.jpg";
      case "female":
        return "./female.jpg";
      default:
        return "./non_specified.jpg";
    }
  };

  const handleSaveEdit = async () => {
    const usernameRegex = /^.{7,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^.{8,}$/;

    if (!usernameRegex.test(newUsername)) {
      setEditError("Username must be at least 7 characters long.");
      return;
    }

    if (!emailRegex.test(newEmail)) {
      setEditError("Please enter a valid email address.");
      return;
    }

    if (newPassword && !passwordRegex.test(newPassword)) {
      setEditError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setEditError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const updatedData = {
        username: newUsername,
        email: newEmail,
        password: newPassword ? newPassword : undefined,
        gender: newGender,
      };

      const updateResult = await updateUser(userId, updatedData);

      if (updateResult.success) {
        setUserData(updateResult.user);
        setEditError(null);

        if (newPassword) {
          setPasswordUpdated(true);
          setTimeout(() => setPasswordUpdated(false), 3000);
        }

        setNewPassword("");
        setConfirmPassword("");
      } else {
        setEditError(updateResult.error || "Failed to update user.");
      }
    } catch (error) {
      setEditError("An error occurred while updating.");
    } finally {
      setLoading(false);
    }
  };

  const isSaveDisabled =
    newUsername === userData?.username &&
    newEmail === userData?.email &&
    newPassword === "" &&
    confirmPassword === "" &&
    newGender === userData?.gender;

  return (
    <div>
      <NavBar />
      {error && <p className="text-red-500">{error}</p>}
      {editError && <p className="text-red-500">{editError}</p>}
      {passwordUpdated && (
        <p className="text-green-500 text-center mt-2">
          Password updated successfully!
        </p>
      )}
      {userData ? (
        <div className="flex flex-col text-white items-center justify-left mt-20 bg-blue-500 rounded-2xl p-10 mx-auto max-w-lg w-full shadow-2xl">
          <img
            src={getAvatar(userData.gender)}
            alt="User Avatar"
            className="w-32 h-32 rounded-full shadow-md mb-4 "
          />
          <div className="text-blue-500 flex flex-col items-center gap-2 bg-gray-100 p-4 rounded-2xl w-full">
            <h1 className="text-gray-100 text-2xl font-bold p-2 bg-blue-500 rounded-xl">
              {userData.username}'s details
            </h1>
            <div className="flex flex-col gap-3 w-full text-gray-400">
              <label
                htmlFor="newUsername"
                className="block font-semibold text-gray-700"
              >
                Username
              </label>
              <input
                id="newUsername"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300"
                placeholder="New Username"
              />
              <label
                htmlFor="email"
                className="block font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300"
                placeholder="New Email"
              />
              <label
                htmlFor="newPassword"
                className="block font-semibold text-gray-700"
              >
                Password
              </label>
              <input
                type="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300"
                placeholder="New Password"
              />
              <label
                htmlFor="confirmNewPassword"
                className="block font-semibold text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300"
                placeholder="Confirm New Password"
              />
              <label
                htmlFor="newGender"
                className="block font-semibold text-gray-700"
              >
                Gender
              </label>
              <select
                id="newGender"
                value={newGender}
                onChange={(e) => setNewGender(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="NON_SPECIFIED">Prefer not to say</option>
              </select>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleSaveEdit}
                disabled={isSaveDisabled || loading}
                className={`px-4 py-2 rounded-md text-white scale-95 transition-transform duration-300 ${
                  isSaveDisabled || loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500 hover:scale-110"
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center mt-8">Loading user data...</p>
      )}
    </div>
  );
};

export default UserProfile;
