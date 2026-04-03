import React, { createContext, useContext, useState, useEffect } from "react";
import { LOCALITIES } from "../data/mockData";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem("velostyle_location");
    return saved ? JSON.parse(saved) : null;
  });

  const [isServiceable, setIsServiceable] = useState(false);
  const [detectedCity, setDetectedCity] = useState(() => {
    const saved = localStorage.getItem("velostyle_detected_city");
    return saved ? JSON.parse(saved) : null;
  });

  // Auto-detect user's city via ip-api.com (using HTTPS endpoint if available, or fetch from backend proxy)
  // Note: ip-api.com free tier is HTTP only. For production HTTPS, you need a paid key or use a different service.
  // For this demo, we'll try to fetch, but handle the fail gracefully.
  useEffect(() => {
    // Check if we already have city data to avoid unnecessary fetch
    const savedCity = localStorage.getItem("velostyle_detected_city");
    if (savedCity) return;

    // fetch from a reliable https source or just skip to avoid errors
    const fetchCity = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        const cityInfo = {
          city: data.city,
          country: data.country_name,
          region: data.region,
        };
        setDetectedCity(cityInfo);
        localStorage.setItem(
          "velostyle_detected_city",
          JSON.stringify(cityInfo),
        );
      } catch (err) {
        console.log("City detection skipped (CORS/Network restriction)");
      }
    };

    fetchCity();
  }, []);

  useEffect(() => {
    if (location) {
      localStorage.setItem("velostyle_location", JSON.stringify(location));
      // Check serviceability
      const locality = LOCALITIES.find(
        (l) =>
          l.name.toLowerCase() === location.area.toLowerCase() ||
          l.pincode === location.pincode,
      );
      setIsServiceable(locality ? locality.serviceable : false);
    } else {
      setIsServiceable(false);
    }
  }, [location]);

  const setArea = (areaNameOrPincode) => {
    const locality = LOCALITIES.find(
      (l) =>
        l.name.toLowerCase() === areaNameOrPincode.toLowerCase() ||
        l.pincode === areaNameOrPincode,
    );

    if (locality) {
      setLocation({ area: locality.name, pincode: locality.pincode });
      return { success: true, serviceable: locality.serviceable };
    } else {
      // Allow setting it but mark as not serviceable if not in our list
      // Or maybe just reject? For this mock, let's accept but mark unserviceable if not found
      setLocation({ area: areaNameOrPincode, pincode: "" });
      return { success: true, serviceable: false };
    }
  };

  return (
    <UserContext.Provider
      value={{ location, isServiceable, setArea, detectedCity }}
    >
      {children}
    </UserContext.Provider>
  );
};
