import { useEffect,useState, createContext } from "react";
export const AuthContext=createContext()

function AuthProvider({children}) {
    const[user,setUser]=useState(null);
    const[loading,setLoading]=useState(true);


    return<>
    </>
}