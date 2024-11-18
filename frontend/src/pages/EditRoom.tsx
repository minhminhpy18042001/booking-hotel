import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import AddRoomForm from "../forms/AddRoomForm/AddRoomForm";

const EditRoom = () => {
    const {hotelId, roomId } = useParams();
    const { showToast } = useAppContext();
    const navigate =useNavigate();
    const { data: room } = useQuery(
        "fetchRoomHotelById",
        () => apiClient.fetchRoomHotelById(hotelId|| "",roomId || ""),
        {
            enabled: !!roomId && !!hotelId,
        }
    );
    const { mutate, isLoading } = useMutation(apiClient.updateRoomHotelById, {
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
    return <AddRoomForm room={room} onSave={handleSave} isLoading ={isLoading}/>;
};

export default EditRoom;