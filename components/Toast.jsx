"use client";
import React from 'react'
import { useEffect } from 'react'

const Toast =({
    message,
    type='error',
    duration=3000,
    onClose
})=>{
    useEffect(()=>{
        const timer=setTimeout(()=>
        onclose(),duration);
        return()=>clearTimeout(timer);
    },[duration,onClose]);
    const bgColor= type==='success'?'bg-green-500':'bg-red-500';

    return(
        <div className={`fixed top-5 right-5 ${bgColor} text-white px-4 py-2 rounded-md shadow-md`} >
                {message}
        </div>
    );
};

export default Toast;