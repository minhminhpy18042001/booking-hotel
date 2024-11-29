import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import ReviewForm from "../forms/ReviewForm/ReviewForm";
const AddReview = () => {
    const { showToast } = useAppContext();
    const navigate =useNavigate();
    const { mutate, isLoading } = useMutation(apiClient.addReview, {
      onSuccess: () => {
        showToast({ message: "Add Review Successed!", type: "SUCCESS" });
        navigate(`/my-bookings`);
      },
      onError: () => {
        showToast({ message: "Error Add Review", type: "ERROR" });
      },
    });
  
    const handleSave = (reviewFormData: FormData) => {
      mutate(reviewFormData);
    };
  
    return <ReviewForm onSave={handleSave} isLoading={isLoading} />;
  };
  
  export default AddReview;