import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function GoogleAuth() {
  const navigate = useNavigate();
  const query = useQuery();

  useEffect(() => {
    const token = query.get("token");
    const userId = query.get("userId");
    const username = query.get("username");
    const email = query.get("email");
    const avatar = query.get("avatar");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      if (avatar && avatar !== "null") {
        localStorage.setItem("avatar", avatar);
      }

      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [navigate, query]);

  return <div>Logging you in, please wait...</div>;
}
