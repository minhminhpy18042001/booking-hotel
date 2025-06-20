import { useFormContext } from "react-hook-form";
import { ReviewFormData } from "./ReviewForm";
import { AiFillStar } from "react-icons/ai";
import { useState } from "react";

const ReviewDetails = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ReviewFormData>();
  const [hovered, setHovered] = useState<number | null>(null);
  const score = watch("score") || 10;
  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-slate-200">
      <h1 className="text-3xl font-extrabold mb-2 text-blue-700 text-center">
        Leave a Review
      </h1>
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 text-base font-semibold">Score</label>
        <div className="flex items-center gap-2 mb-1">
          {[...Array(10)].map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setValue("score", i + 1)}
              onMouseEnter={() => setHovered(i + 1)}
              onMouseLeave={() => setHovered(null)}
            >
              <AiFillStar
                className={`text-2xl ${
                  (hovered || score) > i
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          <input
            type="number"
            min={1}
            max={10}
            className="w-16 ml-4 border rounded py-1 px-2 text-center font-bold"
            {...register("score", { required: "This field is required" })}
          />
        </div>
        {errors.score && (
          <span className="text-red-500 text-sm">{errors.score.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 text-base font-semibold">
          Review Title
        </label>
        <input
          type="text"
          placeholder="E.g. Great stay, friendly staff!"
          className="border rounded w-full py-2 px-3 font-normal focus:ring-2 focus:ring-blue-300"
          {...register("review", { required: "This field is required" })}
        />
        {errors.review && (
          <span className="text-red-500 text-sm">{errors.review.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 text-base font-semibold">Comment</label>
        <textarea
          rows={6}
          placeholder="Share your experience..."
          className="border rounded w-full py-2 px-3 font-normal focus:ring-2 focus:ring-blue-300"
          {...register("comment", { required: "This field is required" })}
        ></textarea>
        {errors.comment && (
          <span className="text-red-500 text-sm">{errors.comment.message}</span>
        )}
      </div>
    </div>
  );
};
export default ReviewDetails;