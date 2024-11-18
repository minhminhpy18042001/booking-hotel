
import AddRoomForm from "../forms/AddRoomForm/AddRoomForm";
import { useAppContext } from "../contexts/AppContext";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";
const AddRoom = () => {
    const { showToast } = useAppContext();
    const navigate =useNavigate();
    const { mutate,isLoading } = useMutation(apiClient.addRoom, {
        onSuccess: () => {
          showToast({ message: "Room Saved!", type: "SUCCESS" });
          navigate(`/my-hotels`);
        },
        onError: () => {
          showToast({ message: "Error Saving Room", type: "ERROR" });
        },
      });
    const handleSave = (roomFormData: FormData) => {
        mutate(roomFormData);
      };
    return <AddRoomForm onSave={handleSave} isLoading ={isLoading}/>;
};
  
  export default AddRoom;