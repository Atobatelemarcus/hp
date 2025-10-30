"use client";
import Loader from "../../../components/Loader";
import { useRouter  } from "next/navigation";
import {useEffect} from "react";

export default function LoaderPage() {
  
  
 
 const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(()=> {router.replace("/get-started")}, 2500);
   
    return () => clearTimeout(timer);
  }, [router]);


    return <Loader />;


}
