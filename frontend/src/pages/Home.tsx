import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LastestDestinationCard";


const Home = () => {
  const { data: hotels } = useQuery("fetchQuery", () =>
    apiClient.fetchHotels()
  );
  const { data: recentlyWatched, isLoading, error } = useQuery('recentlyWatched', apiClient.fetchRecentlyWatchedHotels);
  const { data: recentlyWatchedHotels, isLoading: hotelsLoading } = useQuery(
    ['recentlyWatchedHotels', recentlyWatched],
    () => Promise.all(recentlyWatched.map((id: string) => apiClient.fetchHotelById(id))),
    {
      enabled: !!recentlyWatched, // Only run this query if recentlyWatched has data
    }
  );

  if (isLoading||hotelsLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching recently watched hotels</div>;
  if (!hotels ||!recentlyWatchedHotels ) return <div>No hotels found</div>;
  const topRowHotels = hotels?.slice(0, 2) || [];
  const bottomRowHotels = hotels?.slice(2) || [];

    return (
        <div>
            <div className="space-y-3">
                <h2 className="text-3xl font-bold">Your recent searches</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {recentlyWatchedHotels.map((hotel) => (
                        <LatestDestinationCard hotel={hotel} />
                    ))}
                </div>
            </div>
            <div className="space-y-3">
                <h2 className="text-3xl font-bold">Latest Destinations</h2>
                <p>Most recent desinations booking</p>
                <div className="grid gap-4">
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                        {topRowHotels.map((hotel) => (
                            <LatestDestinationCard hotel={hotel} />
                        ))}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {bottomRowHotels.map((hotel) => (
                            <LatestDestinationCard hotel={hotel} />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;