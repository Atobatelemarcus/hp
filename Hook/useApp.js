"use client";
import { useContext } from "react";
import AppContext from "../Context/AppContext";

const useApp = () => useContext(AppContext);
export default useApp;
