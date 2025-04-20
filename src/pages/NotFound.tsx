
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          {t(
            "Oops! Page not found",
            "అయ్యో! పేజీ కనుగొనబడలేదు"
          )}
        </p>
        <p className="text-gray-600 mb-8">
          {t(
            "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
            "మీరు వెతుకుతున్న పేజీ తొలగించబడి ఉండవచ్చు, దాని పేరు మార్చబడి ఉండవచ్చు లేదా తాత్కాలికంగా అందుబాటులో లేకపోవచ్చు."
          )}
        </p>
        <Link to="/">
          <Button className="btn-large">
            <Home className="mr-2" />
            {t("Return to Home", "హోమ్‌కి తిరిగి వెళ్ళండి")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
