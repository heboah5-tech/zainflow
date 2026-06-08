import { useState, useEffect } from "react";
import { AlertCircle, Smartphone, MapPin, Loader2 } from "lucide-react";

export default function AccessControl({ children }) {
  const [isAllowed, setIsAllowed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restrictionType, setRestrictionType] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Check if device is mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (!isMobile) {
          setIsAllowed(false);
          setRestrictionType("device");
          setLoading(false);
          return;
        }

        // Get location using IP-based geolocation
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        
        // Allow only Kuwait (KW) and Jordan (JO)
        const allowedCountries = ["KW", "JO"];
        if (!allowedCountries.includes(data.country_code)) {
          setIsAllowed(false);
          setRestrictionType("location");
          setLoading(false);
          return;
        }

        setIsAllowed(true);
        setLoading(false);
      } catch (error) {
        // If geolocation fails, deny access
        setIsAllowed(false);
        setRestrictionType("location");
        setLoading(false);
      }
    };

    checkAccess();
  }, []);

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

  if (!isAllowed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
              {restrictionType === "device" ? (
                <Smartphone className="w-8 h-8 text-destructive" />
              ) : (
                <MapPin className="w-8 h-8 text-destructive" />
              )}
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">
                {restrictionType === "device" ? "الوصول غير متاح" : "الخدمة غير متاحة في منطقتك"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {restrictionType === "device" 
                  ? "هذه الخدمة متاحة فقط على الأجهزة المحمولة (الهاتف أو الجهاز اللوحي)"
                  : "هذه الخدمة متاحة فقط في الكويت والأردن"}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                <span>يرجى المحاولة من جهاز محمول وفي المنطقة المسموحة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}