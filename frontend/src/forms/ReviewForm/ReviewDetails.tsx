import { useFormContext } from "react-hook-form";
import { ReviewFormData } from "./ReviewForm";

const ReviewDetails =()=>{
    const {register,formState:{errors}}=useFormContext<ReviewFormData>();
    return(
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-3">Review</h1>
            <label className="text-gray-700 text-sm font-bold max-w-[50%]">
                Score (1 to 10)
                <input
                    type="number"
                    defaultValue={10}
                    min={1}
                    max ={10}
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("score", { required: "This field is required" })}
                ></input>
                {errors.score&& (
                    <span className="text-red-500">{errors.score.message}</span>
                )}
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
                    Review
                    <input
                        type="text"
                        className="border rounded w-full py-1 px-2 font-normal"
                        {...register("review", { required: "This field is required" })}
                    ></input>
                    {errors.review && (
                        <span className="text-red-500">{errors.review.message}</span>
                    )}
                </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Comment
                <textarea
                    rows={10}
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("comment", { required: "This field is required" })}
                ></textarea>
                {errors.comment && (
                    <span className="text-red-500">{errors.comment.message}</span>
                )}
            </label>
        </div>
    )
};
export default ReviewDetails;