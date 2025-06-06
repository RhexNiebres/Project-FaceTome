import { createContext, useContext, useEffect, useState } from "react";
import { getUserById } from "../apiServices/users";
import { getToken, logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      const userId = localStorage.getItem("userId");

      if (!userId || !token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getUserById(userId);
        if (res.success) {
          setUser(res.user);
        } else {
          setError(res.error || "Failed to fetch user");
          logout(navigate);
        }
      } catch (err) {
        setError("An unexpected error occurred");
        logout(navigate);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const getAvatar = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "/male.jpg";
      case "female":
        return "/female.jpg";
      default:
        return "/non_specified.jpg";
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, error, loading, getAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
