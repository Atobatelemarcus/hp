"use client";
import { createContext } from "react";

const AppContext = createContext({
  posts: [],
  setPosts: () => {},
  comments: [],
  setComments: () => {},
  user: null,
  setUser: () => {},
});

export default AppContext;
