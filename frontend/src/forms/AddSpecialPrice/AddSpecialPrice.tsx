import { useState } from "react";
import * as apiClient from "../../api-client";
import DatePicker from "react-datepicker";
import { useAppContext } from "../../contexts/AppContext";

type Props = {
    onClose: React.Dispatch<React.SetStateAction<boolean>>
    roomId: string;
    hotelId: string;
    defaultPrice: number;
}

const AddSpecialPrice = ({ roomId, hotelId,defaultPrice, onClose }: Props) => {
    const [specialPrice, setSpecialPrice] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const { showToast } = useAppContext();
    const calculatePercentageChange = (specialPrice: number, defaultPrice: number) => {
        if (defaultPrice === 0) return 0;
        if (!specialPrice ) return 0;
        const percentageChange = ((specialPrice - defaultPrice) / defaultPrice) * 100;
        return Math.round(percentageChange * 100) / 100;
    };
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
          if ( specialPrice && selectedDay) {
            const offset = selectedDay.getTimezoneOffset() * 60 * 1000; // Get the offset in milliseconds
            const utcDate = new Date(selectedDay.getTime() - offset);
            const percentChange=calculatePercentageChange(Number(specialPrice) || 0, defaultPrice) //  Add the offset to the date
            apiClient.saveSpecialPrice(
              hotelId,
              roomId,
              percentChange.toString(),
              utcDate.toISOString(),
            ).then(() => {
                showToast({ message: 'Special price saved successfully', type: 'SUCCESS' });
                onClose(false); 
              })
              .catch((error) => {
                showToast({ message: error.message, type: 'ERROR' });
              });
      };
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
                <div className="flex justify-end mb-4">
                    <button onClick={() => onClose(false)}>x</button>
                </div>
                <h2 className="text-2xl font-bold mb-6">Add Special Price</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 flex justify-between">
                        <div className="w-1/2 mr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                                Price
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="price"
                                type="number"
                                min={0}
                                name="price"
                                value={specialPrice ?? ""}
                                onChange={(event) => setSpecialPrice(event.target.value)}
                                required
                            />
                            <span
                                className={`text-sm ${calculatePercentageChange(Number(specialPrice) || 0, defaultPrice) > 0
                                        ? 'text-green-600'
                                        : calculatePercentageChange(Number(specialPrice) || 0, defaultPrice) < 0
                                            ? 'text-red-600'
                                            : 'text-gray-700'
                                    }`}
                            >
                                {calculatePercentageChange(Number(specialPrice) || 0, defaultPrice)}%
                            </span>
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="defaultPrice">
                                Default Price
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="defaultPrice"
                                type="number"
                                name="defaultPrice"
                                value={defaultPrice ?? 0}
                                readOnly
                                required
                            />
                            
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                            Date
                        </label>
                        <DatePicker
                            id="date"
                            selected={selectedDay}
                            onChange={(date) => setSelectedDay(date as Date)}
                            selectsStart
                            //startDate={new Date()}
                            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                          />
                    </div>                 
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Add Special Price
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSpecialPrice;