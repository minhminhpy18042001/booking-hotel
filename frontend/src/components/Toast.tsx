type ToastProps ={
    message:string;
    type:"SUCCESS"|"ERROR"
};

const Toast =({message,type}:ToastProps )=>{

    

    const styles=type ==="SUCCESS"
     ? "fixed top-4 right-4 z-50 rounded-md bg-green-600 text-white max-w-md"
     : "fixed top-4 right-4 z-50 rounded-md bg-red-600 text-white max-w-md"

    return(
        <div className={styles}>
            <div className="flex justify-center items-center">
                <span className="text-lg font-semibold">
                    {message}
                </span>
            </div>
        </div>
    );
};