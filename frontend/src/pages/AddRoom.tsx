
import AddRoomForm from "../forms/AddRoomForm/AddRoomForm";
import { useAppContext } from "../contexts/AppContext";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
const AddRoom = () => {
    const { showToast } = useAppContext();
    const { mutate,isLoading } = useMutation(apiClient.addRoom, {
        onSuccess: () => {
          showToast({ message: "Room Saved!", type: "SUCCESS" });
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