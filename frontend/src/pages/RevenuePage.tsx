// RevenuePage.tsx
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useQuery,useQueryClient } from "react-query";
import styles from "./../css/HotelManage.module.css"
import { useState } from "react";
import moment from 'moment';
interface RevenueData {
    date:Date;
    hotelName: string;
    revenue: number;
}
const RevenuePage = () => {
    const { id,startDate,endDate } = useParams();
    
    const [startDatee, setStartDate] = useState(startDate);
    const [endDatee, setEndDate] = useState(endDate);;
    const queryClient = useQueryClient();
    const { data: revenue, isLoading, isError } = useQuery(["fetchRevenueByHotelIdAndDateRange", id,startDatee,endDatee], () => apiClient.fetchRevenueByHotelIdAndDateRange(id || "",startDatee || "",endDatee || ""),
    {
        enabled: !!startDate && !!endDate && !!id,
    });


    const handleFilter = () => {
        queryClient.invalidateQueries("fetchRevenueByHotelIdAndDateRange");
      };
    
      return (
        <div className={styles.container}>
          <h2>Revenue</h2>
          <div className={styles.filter}>
            <label>Start Date:</label>
            <input type="date" value={startDatee} onChange={(e) => setStartDate(e.target.value)} />
            <label>End Date:</label>
            <input type="date" value={endDatee} onChange={(e) => setEndDate(e.target.value)} />
            <button onClick={handleFilter}>Filter</button>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error fetching revenue data</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{revenue.hotelName}</th>
                  <th>Revenue $</th>
                </tr>
              </thead>
              <tbody>
                {revenue?.map((data: RevenueData, index: number) => (
                  <tr key={index} >
                    <td>
                        {moment(data.date).format('DD-MM-YYYY')}
                    </td>
                    <td>{data.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    };

export default RevenuePage;