"use client";
import { useState} from "react";
import AppContext from "./AppContext";


export function AppProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch all posts when app loads
  

  const value = {
    posts,
    setPosts,
    comments,
    setComments,
    user,
    setUser,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
