import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get(
          "https://truewallet.onrender.com/api/v1/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.data);
      } catch (error) {
        console.log("Error fetching user profile:", error);
      }
    }
    getUser();
  }, []);

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    setUser(userData); // Set user data
    console.log("User logged in:", userData); 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully")
  };


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
