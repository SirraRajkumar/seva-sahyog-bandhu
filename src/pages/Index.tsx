
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    document.title = "ASHASEVA - Rural Healthcare Companion";
  }, []);

  // Redirect to welcome page
  return <Navigate to="/" replace />;
};

export default Index;
