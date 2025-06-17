import { useState, useEffect } from "react";
import { updateUser } from "../apiServices/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const UserProfileForm = ({ user, setUser, getAvatar }) => {
  const [error, setError] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newGender, setNewGender] = useState("");
  const [editError, setEditError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const isPasswordEditable = !!user?.password;
  const isGuest = user?.email === "guest@example.com";
  
  useEffect(() => {
    if (user) {
      setNewUsername(user.username || "");
      setNewEmail(user.email || "");
      setNewGender(user.gender || "");
    }
  }, [user]);

  const handleSaveEdit = async () => {
    const usernameRegex = /^.{6,8}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^.{8,}$/;

    if (!usernameRegex.test(newUsername)) {
      setEditError("Username must be at least 6 characters long.");
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

    if (isGuest) {
      setEditError("Guest account cannot be edited.");
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

      const updateResult = await updateUser(user.id, updatedData);

      if (updateResult.success) {
        setUser({ ...user, ...updateResult.user });
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
    newUsername === user?.username &&
    newEmail === user?.email &&
    newPassword === "" &&
    confirmPassword === "" &&
    newGender === user?.gender;

  return (
    <div className="px-4">
      {error && <p className="text-red-500">{error}</p>}
      {editError && <p className="text-red-500">{editError}</p>}
      {passwordUpdated && (
        <p className="text-green-500 text-center mt-2">
          Password updated successfully!
        </p>
      )}

      {user ? (
        <div className="flex flex-col text-white items-center mt-10 bg-4 rounded-2xl p-6 sm:p-10 mx-auto w-full max-w-xl shadow-2xl">
          <img
            src={user.profilePicture || getAvatar(user.gender)}
            alt="User Avatar"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full shadow-md mb-4"
          />
          <form className="flex flex-col items-center gap-4 bg-2 p-4 rounded-2xl w-full">
            <h1 className="text-gray-100 text-2xl font-bold p-2 border-b w-full text-center">
              {user.username}'s details
            </h1>
            <div className="flex flex-col gap-3 w-full text-2">
              <label
                htmlFor="newUsername"
                className="font-semibold text-gray-200"
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
                minLength={6}
                maxLength={8}
                disabled={isGuest}
              />
              <p className="text-sm text-gray-400">
                {newUsername.length}/8 characters
              </p>

              {isPasswordEditable && (
                <>
                  <label
                    htmlFor="email"
                    className="font-semibold text-gray-200"
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
                    className="font-semibold text-gray-200"
                  >
                    Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="px-4 py-2 rounded-md border border-gray-300"
                    placeholder="New Password"
                    disabled={isGuest}
                  />

                  <label
                    htmlFor="confirmNewPassword"
                    className="font-semibold text-gray-200"
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
                    disabled={isGuest}
                  />
                </>
              )}

              <label
                htmlFor="newGender"
                className="font-semibold text-gray-300"
              >
                Gender
              </label>
              <select
                id="newGender"
                value={newGender}
                onChange={(e) => setNewGender(e.target.value)}
                disabled={isGuest}
                className="px-4 py-2 rounded-md border border-gray-300"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="NON_SPECIFIED">Prefer not to say</option>
              </select>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-4 w-full">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSaveEdit();
                }}
                disabled={isSaveDisabled || loading}
                className={`px-4 py-2 rounded-md text-white scale-95 transition-transform duration-300 ${
                  isSaveDisabled || loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500 hover:scale-105"
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex justify-center items-center p-10">
          <FontAwesomeIcon
            icon={faCircleNotch}
            spin
            className="text-blue-500 text-3xl"
          />
        </div>
      )}
    </div>
  );
};

export default UserProfileForm;
