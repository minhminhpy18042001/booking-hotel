import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import ReviewForm, { ReviewFormData } from "../forms/ReviewForm/ReviewForm";

const EditReview = () => {
    const {bookingId } = useParams();
    const { showToast } = useAppContext();
    const navigate =useNavigate();
    const { data: booking} = useQuery(
        "fetchReviewById",
        () => apiClient.fetchReviewById(bookingId||""),
        {
            enabled: !!bookingId,
        }
    );
    let review: ReviewFormData = { bookingId: "", score: 1, review: "",comment:"" };
    if (booking) {
        review = { bookingId: booking._id, score: booking.rating.score, review: booking.rating.review,comment:booking.rating.comment};
    }
    const { mutate, isLoading } = useMutation(apiClient.addReview, {
        onSuccess: () => {
          showToast({ message: "Review Saved!", type: "SUCCESS" });
          navigate(`/my-bookings`);
        },
        onError: () => {
          showToast({ message: "Error Saving Review", type: "ERROR" });
        },
      });
    
      const handleSave = (reviewFormData: FormData) => {
        mutate(reviewFormData);
      };
    return(<ReviewForm review={review} onSave={handleSave} isLoading ={isLoading}/>)
};

export default EditReview;