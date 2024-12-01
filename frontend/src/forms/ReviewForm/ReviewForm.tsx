import { FormProvider, useForm } from "react-hook-form";

import { useParams } from "react-router-dom";
import ReviewDetails from "./ReviewDetails";
import { useEffect } from "react";
export type ReviewFormData = {
   bookingId:string;
   score:number;
   review: string;
   comment:string;
};
type Props = {
    review?:ReviewFormData
    onSave: (reviewFormData: FormData) => void;
    isLoading: boolean;
};


const ReviewForm = ({ onSave,isLoading,review}: Props) => {
    const formMethods = useForm<ReviewFormData>();
    const { handleSubmit,reset} = formMethods;
    useEffect(()=>{
        reset(review);
    },[review,reset])

    const { bookingId } = useParams();
    // const {data: hotel}=useQuery("fetchHotelById",()=>apiClient.fetchHotelById(hotelId as string),{enabled:!!hotelId,});
    // if(!hotel){
    //     return<></>
    // }
    if(!bookingId){
        return <></>
    }
    const onSubmit = handleSubmit((formDataJson: ReviewFormData) => {
        const formData = new FormData();
        formData.append("bookingId",bookingId)
        formData.append("score", formDataJson.score.toString());
        formData.append("review",formDataJson.review);
        formData.append("comment",formDataJson.comment);
        onSave(formData);
    });

    return (
        <FormProvider {...formMethods}>
            <form className="flex flex-col gap-10" onSubmit={onSubmit}>
                <ReviewDetails/>
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

export default ReviewForm;