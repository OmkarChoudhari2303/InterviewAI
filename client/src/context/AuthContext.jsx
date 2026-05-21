import{createContext, useEffect, useState} from "react";
import axiosInstance from "../api/axios";

export const AuthContext = createContext();

function AuthProvider({children}){
    const [user,setUser] = useState(null);
    const [token,setToken] = useState(null);
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        
        if(storedToken && storedUser){
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setLoading(false)
    },[])

    const login = (userData,accessToken)=>{
        setUser(userData);
        setToken(accessToken);

        localStorage.setItem("token",accessToken);
        localStorage.setItem("user",JSON.stringify(userData));
    }

    //For logout we make userdata null and token null
    const logout = async ()=>{
        try{
            await axiosInstance.post("/auth/logout")
        }catch(error){
            console.log(error);
        }

        setUser(null);
        setToken(null);

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    }

    return(
        <AuthContext.Provider
        value={{
            user,
            token,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;