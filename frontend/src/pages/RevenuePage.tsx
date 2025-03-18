import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useQuery, useQueryClient } from "react-query";
import styles from "./../css/HotelManage.module.css";
import { useState } from "react";
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueData {
  date: Date;
  hotelName: string;
  revenue: number;
}

const RevenuePage = () => {
  const { id, startDate, endDate } = useParams();

  const [startDatee, setStartDate] = useState(startDate);
  const [endDatee, setEndDate] = useState(endDate);
  const queryClient = useQueryClient();
  const { data: revenue, isLoading, isError } = useQuery(
    ["fetchRevenueByHotelIdAndDateRange", id, startDatee, endDatee],
    () => apiClient.fetchRevenueByHotelIdAndDateRange(id || "", startDatee || "", endDatee || ""),
    {
      enabled: !!startDate && !!endDate && !!id,
    }
  );

  const handleFilter = () => {
    queryClient.invalidateQueries("fetchRevenueByHotelIdAndDateRange");
  };

  const chartData = {
    labels: revenue?.revenueData.map((data: RevenueData) => moment(data.date).format('DD-MM-YYYY')),
    datasets: [
      {
        label: 'Revenue',
        data: revenue?.revenueData.map((data: RevenueData) => data.revenue),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
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
        <>
          <Line data={chartData} />
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{revenue.hotelName}</th>
                <th>Revenue ({revenue.totalRevenue})$</th>
              </tr>
            </thead>
            <tbody>
              {revenue?.revenueData.map((data: RevenueData, index: number) => (
                <tr key={index}>
                  <td>{moment(data.date).format('DD-MM-YYYY')}</td>
                  <td>{data.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default RevenuePage;