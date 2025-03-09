// RevenueManage.tsx
import { useQuery, useQueryClient } from "react-query";
import * as apiClient from "../../api-client";
import styles from "./../../css/HotelManage.module.css"
import { Link } from "react-router-dom";
import { useState } from "react";
import moment from 'moment';
interface RevenueData {
    id:string;
    hotelName: string;
    revenue: number;
}

const RevenueManage = () => {
    // Fetch revenue data from API or database
    const today = moment();
    const defaultStartDate = today.clone().startOf('month').format('YYYY-MM-DD');
    const defaultEndDate = today.clone().format('YYYY-MM-DD');

    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);;
    const queryClient = useQueryClient()


    const { data: revenue, isLoading, isError } = useQuery(
        ["fetchRevenue", startDate, endDate],
        () => apiClient.fetchRevenueByDateRange(startDate, endDate),
        {
          enabled: !!startDate && !!endDate,
        }
      );
    
      const handleFilter = () => {
        queryClient.invalidateQueries("fetchRevenue");
      };
    
      return (
        <div className={styles.container}>
          <h2>Revenue</h2>
          <div className={styles.filter}>
            <label>Start Date:</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <label>End Date:</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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
                  <th>Hotel</th>
                  <th>Revenue $</th>
                </tr>
              </thead>
              <tbody>
                {revenue?.map((data: RevenueData, index: number) => (
                  <tr key={index}>
                    <td>
                      <Link to={`/revenue/${data.id}/${startDate}/${endDate}`}>
                        {data.hotelName}
                      </Link>
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
    

//     const {data: revenue} = useQuery("fetchRevenue",()=>apiClient.fetchRevenue());
//     return (
//         <div className={styles.container}>
//             <h2>Revenue</h2>
//             <table className={styles.table}>
//                 <thead>
//                     <tr>
//                         <th>Hotel</th>
//                         <th>Revenue $</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {revenue?.map((data: RevenueData, index: number) => (
//                         <tr key={index}>
//                             <td>
//                                 <Link to={`/revenue/${data.id}`}>
//                                     {data.hotelName}
//                                 </Link>
//             </td>
//                             <td>{data.revenue}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

export default RevenueManage;