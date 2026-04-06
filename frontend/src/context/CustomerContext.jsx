import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api";

const CustomerContext = createContext();

export const useCustomer = () => useContext(CustomerContext);

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("customer_token");
    if (token) {
      apiService.getCustomerMe()
        .then((res) => setCustomer(res.data))
        .catch(() => localStorage.removeItem("customer_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await apiService.customerLogin(email, password);
    localStorage.setItem("customer_token", res.data.token);
    setCustomer(res.data.customer);
    return res.data;
  };

  const register = async (name, email, password, phone) => {
    const res = await apiService.customerRegister({ name, email, password, phone });
    localStorage.setItem("customer_token", res.data.token);
    setCustomer(res.data.customer);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("customer_token");
    setCustomer(null);
  };

  return (
    <CustomerContext.Provider value={{ customer, loading, login, register, logout }}>
      {children}
    </CustomerContext.Provider>
  );
};
