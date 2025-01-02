"use client";
import React from "react";
import LoginPage from "./auth/login/page";
import Dashboard from "./dashboard/page";

const Home = () => {
  const token = localStorage.getItem("access_token");
  return token ? <Dashboard /> : <LoginPage />;
};

export default Home;
