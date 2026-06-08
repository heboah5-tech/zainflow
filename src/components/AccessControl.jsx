import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function AccessControl({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Check if device is mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (!isMobile) {
          navigate("/404-restricted");
          return;
        }

        // Get location using IP-based geolocation
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        
        // Allow only Kuwait (KW) and Jordan (JO)
        const allowedCountries = ["KW", "JO"];
        if (!allowedCountries.includes(data.country_code)) {
          navigate("/404-restricted");
          return;
        }

        setLoading(false);
      } catch (error) {
        // If geolocation fails, deny access
        navigate("/404-restricted");
      }
    };

    checkAccess();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-accent" />
          <p className="text-muted-foreground font-medium">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}