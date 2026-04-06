import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    apiService
      .getCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
  }, []);

  return (
    <AppContext.Provider value={{ categories, categoriesLoading }}>
      {children}
    </AppContext.Provider>
  );
};
