import React, { useContext,useState } from "react";
import Toast from "../components/Toast";
import {useQuery} from "react-query";
import * as apiClient from "../api-client";
type ToastMessage={
    message:string;
    type:"SUCCESS"|"ERROR";
};


type AppContext ={
    showToast:(toastMessage:ToastMessage) => void;
    isLoggedIn:boolean;
    isOwner:boolean;
};
const AppContext =React.createContext<AppContext|undefined>(undefined);


export const AppContextProvider =({children}:{children:React.ReactNode}) =>{
    const [toast,setToast]= useState<ToastMessage|undefined>(undefined);
    const {data:user,isError}=useQuery("validateToken",apiClient.validateToken,{
        retry:false,
    })
    const isOwner = user?.role === "owner";
    return(
        <AppContext.Provider value={{
            showToast:(toastMessage)=>{
                setToast(toastMessage);
            },
            isLoggedIn:!isError,
            isOwner:isOwner,
        }}>
            {toast &&(<Toast message={toast.message} type={toast.type} onClose={()=>setToast(undefined)}
                />)}
            {children}
        </AppContext.Provider>
    )
}; 

export const useAppContext=()=>{
    const context =useContext(AppContext);
    return context as AppContext;
};