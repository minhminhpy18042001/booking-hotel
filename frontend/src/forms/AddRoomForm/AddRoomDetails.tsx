import { useFormContext } from "react-hook-form"
import { RoomFormData } from "./AddRoomForm";
const AddRoomDetails =()=>{
    const {register,watch,setValue,formState:{errors}}=useFormContext<RoomFormData>();
    const existingImageUrls=watch("imageUrls");
    const handleDelete=(event:React.MouseEvent<HTMLButtonElement,MouseEvent>,imageUrl:string) =>{
        event.preventDefault();
        setValue("imageUrls",existingImageUrls.filter((url)=>url !==imageUrl));
    };
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-3">Room</h1>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Name
                <input
                    type="text"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("name", { required: "This field is required" })}
                ></input>
                {errors.name && (
                    <span className="text-red-500">{errors.name.message}</span>
                )}
            </label>   
            <label className="text-gray-700 text-sm font-bold max-w-[50%]">
                Room Size (m<sup>2</sup>)
                <input
                    type="number"
                    min={1}
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("roomSize", { required: "This field is required" })}
                ></input>
                {errors.roomSize&& (
                    <span className="text-red-500">{errors.roomSize.message}</span>
                )}
            </label>
            <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
            <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...register("description", { required: "This field is required" })}>
                <option selected>Choose type bed</option>
                <option value="1 Double Bed">1 Double Bed</option>
                <option value="1 Single Bed">1 Single Bed</option>
                <option value="2 Single Bed">2 Single Bed</option>
            </select>
            </div>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Description
                <textarea
                    rows={10}
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("description", { required: "This field is required" })}
                ></textarea>
                {errors.description && (
                    <span className="text-red-500">{errors.description.message}</span>
                )}
            </label>
            
            <div>
                <h2 className="text-2xl font-bold mb-3">Images </h2>
                <div className="border rounded p-4 flex flex-col gap-4">
                    {existingImageUrls && (
                        <div className="grid grid-cols-6 gap-4">
                            {existingImageUrls.map((url) => (
                                <div className="relative group">
                                    <img src={url} className="min-h-full object-cover" />
                                    <button
                                        onClick={(event) => handleDelete(event, url)}
                                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <input type="file"
                        multiple
                        accept="image/*"
                        className="w-full text-gray-700 font-normal"
                        {...register("imageFiles", {
                            validate: (imageFiles) => {
                                const totalLength = imageFiles.length + (existingImageUrls?.length || 0);
                                if (totalLength === 0) {
                                    return "At least one image should be added";
                                }
                                if (totalLength > 6) {
                                    return "Total number of images cannot be more than 6";
                                }
                                return true;
                            }
                        })} />
                </div>
                {errors.imageFiles && (
                    <span className="text-red-500 text-sm font-bold">
                        {errors.imageFiles.message}
                    </span>
                )}
            </div>
 
        </div>
    );
};
export default AddRoomDetails;