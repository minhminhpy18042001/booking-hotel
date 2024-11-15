import { FormProvider, useForm } from "react-hook-form";

import AddRoomDetails from "./AddRoomDetails";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import * as apiClient from "../../api-client";
export type RoomFormData = {
    name: string;
    description: string;
    typeBed: string;
    roomSize:string;
    imageFiles: FileList;
    imageUrls:string[];
    hotelId:string;
};
type Props = {
    onSave: (hotelFormData: FormData) => void;
    isLoading: boolean;
};


const AddRoomForm = ({ onSave,isLoading}: Props) => {
    const formMethods = useForm<RoomFormData>();
    const { handleSubmit} = formMethods;

    const { hotelId } = useParams();
    const {data: hotel}=useQuery("fetchHotelById",()=>apiClient.fetchHotelById(hotelId as string),{enabled:!!hotelId,});
    if(!hotel){
        return<></>
    }
    const onSubmit = handleSubmit((formDataJson: RoomFormData) => {
        const formData = new FormData();
        formData.append("name", formDataJson.name);
        formData.append("roomSize",formDataJson.roomSize);
        formData.append("description", formDataJson.description);
        formData.append("typeBed", formDataJson.typeBed);
        formData.append('hotelId',hotelId||"");
        if (formDataJson.imageUrls) {
            formDataJson.imageUrls.forEach((url, index) => {
              formData.append(`imageUrls[${index}]`, url);
            });
          }

        Array.from(formDataJson.imageFiles).forEach((imageFile) => {
            formData.append(`imageFiles`, imageFile);
        });
        onSave(formData);
    });

    return (
        <FormProvider {...formMethods}>
            <form className="flex flex-col gap-10" onSubmit={onSubmit}>
                <AddRoomDetails/>
                <span className="flex justify-end">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </span>
            </form>
        </FormProvider>
    );
};

export default AddRoomForm;