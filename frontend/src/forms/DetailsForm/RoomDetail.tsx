// RoomDetail.tsx
import React from 'react';
import { useQuery } from 'react-query';
import * as apiClient from "../../api-client";
type Props = {
    onClose: React.Dispatch<React.SetStateAction<boolean>>
    roomId: string;
    hotelId: string;
}
const RoomDetail = ({ roomId, hotelId, onClose }: Props) => {
    const { data: room } = useQuery("fetchRoomHotelById", () => apiClient.fetchRoomHotelById(hotelId as string, roomId as string), { enabled: !!hotelId && !!roomId });
    return (room &&
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
                <div className="flex justify-end mb-4">
                    <button onClick={() => onClose(false)}>x</button>
                </div>
                <h2 className="text-2xl font-bold mb-6">{room.name}</h2>
                <div className="text-lg font-normal text-gray-700 mb-6">
                    <strong>Size:</strong> {room.roomSize} m<sup>2</sup><br />
                    <strong>Price:</strong> {room.pricePerNight} $<br />
                    <strong>Type of Bed:</strong> {room.typeBed}<br />
                    <strong>Description:</strong> {room.description}
                </div>
                <div className="mb-6">
                    <strong>Images:</strong>
                    <div className="flex flex-wrap">
                        {room.imageUrls && room.imageUrls.map((image: string, index: number) => (
                            <img key={index} src={image} alt={`Room image ${index + 1}`} className="w-32 h-32 object-cover m-2" />
                        ))}
                    </div>
                </div>
                <div className="flex justify-end">
                    <button onClick={() => onClose(false)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;