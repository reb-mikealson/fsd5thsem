import { useEffect,useState, createContext } from "react";
export const AuthContext=createContext()

function AuthProvider({children}) {
    const[user,setUser]=useState(null);
    const[users,setUsers]=useState(true);
    useEffect(()=>{
        fetch('/data/users.json')
    },[])

    return<>
    </>
}