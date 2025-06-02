import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProtectedRoute from "./services/ProtectedRoute";
import "../src/styles/App.css";
import App from "./App";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFound";
import GoogleAuth from "./services/GoogleAuth";
import UserProfilePage from "./pages/UserProfilePage";
import FindFriendsPage from "./pages/FindFriendsPage";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}/>
        <Route index element={<LandingPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/community" element={<FindFriendsPage />} />
        </Route>

      
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/oauth-success" element={<GoogleAuth />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
