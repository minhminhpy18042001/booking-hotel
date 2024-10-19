import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";

const EditHotel = () => {
    const { hotelId } = useParams();
    const { showToast } = useAppContext();

    const { data: hotel } = useQuery(
        "fetchMyHotelById",
        () => apiClient.fetchMyHotelById(hotelId || ""),
        {
            enabled: !!hotelId,
        }
    );
    return (
        <ManageHotelForm hotel={hotel}  />
    );
};

export default EditHotel;