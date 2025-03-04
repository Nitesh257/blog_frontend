import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user,setUser]=useState("");
  const [services,setServices]=useState("")
  const storetokenInLS = (serverToken) => {
    setToken(serverToken);
    return localStorage.setItem("token", serverToken);
  };

  let isLoggedIn=!!token;

  //tackling the logout functionallity
  const LogoutUser = () => {
    setToken("");
    return localStorage.removeItem("token");
  };

  //authentication jwt to get loggged in user daat
  const userAuthentication=async()=>{
    try {
      const response=await fetch("https://blogbackend-zz2d.onrender.com/api/auth/user",{
        method:"GET",
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      if(response.ok){
        const data=await response.json();
        
        setUser(data.userData);
      }
    } catch (error) {
      console.log("error fetching data");
      
    }
  };
  const getServices=async()=>{
    try {
      const response=await fetch("https://blogbackend-zz2d.onrender.com/api/data/service",{
        method:"GET",
      });
      if(response.ok){
        const data=await response.json();
        setServices(data.msg);
        
      }
    } catch (error) {
      console.log(error);
      
    }
  } 



  useEffect(()=>{
    getServices();
    userAuthentication();
  },[])

  return (
    <AuthContext.Provider value={{ isLoggedIn,storetokenInLS, LogoutUser,user,services }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used ouside of the Provider");
  }
  return authContextValue;
};
