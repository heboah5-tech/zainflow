import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Kuwait and Jordan country codes (alpha-2)
const ALLOWED_COUNTRIES = ["KW", "JO"];

// Simple mobile device detection regex patterns
const MOBILE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get client IP from headers (Base44 provides this)
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0] || 
                     req.headers.get("x-real-ip") || 
                     "";
    
    // Get user agent
    const userAgent = req.headers.get("user-agent") || "";
    
    // Check if device is mobile
    const isMobile = MOBILE_REGEX.test(userAgent);
    
    if (!isMobile) {
      return Response.json({ 
        allowed: false, 
        reason: "desktop",
        message: "الخدمة متاحة فقط للأجهزة المحمولة"
      });
    }
    
    // For country check, we'll use a free IP geolocation API
    // In production, you might want to use a paid service for better reliability
    let country = "";
    try {
      // Using ipapi.co for free IP geolocation (no API key needed for basic usage)
      const geoRes = await fetch(`https://ipapi.co/${clientIP}/json/`, {
        headers: { "Accept": "application/json" },
      });
      
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        country = geoData.country_code || "";
      }
    } catch (geoError) {
      console.error("Geolocation error:", geoError);
      // If geolocation fails, we'll allow access but log it
      country = "UNKNOWN";
    }
    
    const isAllowedCountry = ALLOWED_COUNTRIES.includes(country);
    
    if (!isAllowedCountry && country !== "UNKNOWN") {
      return Response.json({ 
        allowed: false, 
        reason: "country",
        country,
        message: "الخدمة متاحة فقط في الكويت والأردن"
      });
    }
    
    return Response.json({ 
      allowed: true, 
      country,
      isMobile 
    });
    
  } catch (error) {
    return Response.json({ 
      allowed: true, // Fail open on server errors
      error: error.message 
    });
  }
});