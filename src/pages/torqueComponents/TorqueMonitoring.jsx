import { useState, useEffect, useCallback } from "react";
import { ChevronDown, RefreshCw, AlertTriangle, Wifi, WifiOff, LayoutGrid } from "lucide-react";
import SummaryCard from "./SummaryCard";
import StationCard from "./StationCard";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";


// Dummy filter options
const lines = ["All Lines", "Line 1", "Line 2"];
const stationsList = ["All Stations", "Station 1", "Station 2"];
const torqueGuns = ["All Torque Gun", "Torque Gun 1", "Torque Gun 2"];
const dates = ["Today", "Yesterday", "Last 7 Days"];

export default function TorqueMonitoring() {
    // Dropdown states
    const { authUser } = useAuth();
    const [selectedLine, setSelectedLine] = useState(lines[0]);
    const [selectedStation, setSelectedStation] = useState(stationsList[0]);
    const [selectedTorqueGun, setSelectedTorqueGun] = useState(torqueGuns[0]);
    const [selectedDate, setSelectedDate] = useState(dates[0]);
    const [onlineStations , setOnlineStations]=useState(0)
    const [offlineStations , setOfflineStations]=useState(0);
    const [latestData , setLatestData]=useState({})
    const [alerts,setAlerts]=useState(0)

    const [dropdown, setDropdown] = useState(""); // which dropdown is open

    // Data states
    const [loading, setLoading] = useState();
    const [stations, setStations] = useState([]);

    const fetchData = useCallback(async () => {
        const token = authUser?.token;
        if (!token) {
            console.error(
                "No token found in LocalStorage. User might be logged out."
            );
            return;
        }
        const headers = {
            Authorization: `Bearer ${token}`, // Ensure proper Bearer token format
        };
        

        
        try {
            const response = await axios.get(
                `${"http://20.198.22.6:3001/torqueGun/data"
                }`,
                { headers }
            );

           
                const apiData =await  response.data.data;
               setStations(apiData);
               setLatestData(response.data.latestData)
               setOnlineStations(response.data.connectedCount)
               setOfflineStations(response.data.unconnectedCount);
               setAlerts(response.data.alerts)
   
           
        } catch (err) {
            console.error("Error fetching data:", err);
            
        }
    }, []);

    // const fetchInflux = async () => {
    //     const token = authUser?.token;
    //     if (!token) {
    //         console.error(
    //             "No token found in LocalStorage. User might be logged out."
    //         );
    //         return;
    //     }
    //     const headers = {
    //         Authorization: `Bearer ${token}`, // Ensure proper Bearer token format
    //     };
    //     setLoading(true);
    //     try {
    //         const response = await axios.get(
    //             `${"http://20.198.22.6:3001/torqueGun/data"
    //             }`,
    //             { headers }
    //         );
    //         setStations(response.data.data);
    //         setLoading(false);
    //     } catch (error) {
    //         console.error("Error fetching influxdata:", error);
    //     }
    // };


    // Fetch data (dummy or API)
    useEffect(() => {
        
        // setTimeout(() => {
        //     setStations([
        //         {
        //             id: 1,
        //             torqueGun: 1,
        //             position: 1,
        //             torqueValuePercent: 82,
        //             torqueAnglePercent: 93,
        //             totalReadings: 1150,
        //             inSpec: 1000,
        //             outOfSpec: 150,
        //             hasAlert: true,
        //             online: false,
        //             valueGraphData: [
        //                 { time: '06', value: 40 }, { time: '07', value: 55 }, { time: '08', value: 60 },
        //                 { time: '09', value: 70 }, { time: '10', value: 80 }, { time: '11', value: 90 },
        //                 { time: '12', value: 85 }, { time: '13', value: 75 }, { time: '14', value: 60 }
        //             ],
        //             angleGraphData: [
        //                 { time: '06', value: 50 }, { time: '07', value: 65 }, { time: '08', value: 70 },
        //                 { time: '09', value: 80 }, { time: '10', value: 90 }, { time: '11', value: 100 },
        //                 { time: '12', value: 95 }, { time: '13', value: 85 }, { time: '14', value: 70 }
        //             ]
        //         },
        //         {
        //             id: 2,
        //             torqueGun: 2,
        //             position: 1,
        //             torqueValuePercent: 88,
        //             torqueAnglePercent: 90,
        //             totalReadings: 980,
        //             inSpec: 950,
        //             outOfSpec: 30,
        //             hasAlert: false,
        //             online: true,
        //             valueGraphData: [
        //                 { time: '06', value: 60 }, { time: '07', value: 65 }, { time: '08', value: 70 },
        //                 { time: '09', value: 80 }, { time: '10', value: 90 }, { time: '11', value: 100 },
        //                 { time: '12', value: 95 }, { time: '13', value: 85 }, { time: '14', value: 70 }
        //             ],
        //             angleGraphData: [
        //                 { time: '06', value: 55 }, { time: '07', value: 60 }, { time: '08', value: 65 },
        //                 { time: '09', value: 75 }, { time: '10', value: 85 }, { time: '11', value: 95 },
        //                 { time: '12', value: 90 }, { time: '13', value: 80 }, { time: '14', value: 65 }
        //             ]
        //         },
        //         {
        //             id: 3,
        //             torqueGun: 1,
        //             position: 2,
        //             torqueValuePercent: 75,
        //             torqueAnglePercent: 80,
        //             totalReadings: 1200,
        //             inSpec: 1100,
        //             outOfSpec: 100,
        //             hasAlert: false,
        //             online: true,
        //             valueGraphData: [
        //                 { time: '06', value: 30 }, { time: '07', value: 40 }, { time: '08', value: 50 },
        //                 { time: '09', value: 60 }, { time: '10', value: 70 }, { time: '11', value: 80 },
        //                 { time: '12', value: 75 }, { time: '13', value: 65 }, { time: '14', value: 50 }
        //             ],
        //             angleGraphData: [
        //                 { time: '06', value: 35 }, { time: '07', value: 45 }, { time: '08', value: 55 },
        //                 { time: '09', value: 65 }, { time: '10', value: 75 }, { time: '11', value: 85 },
        //                 { time: '12', value: 80 }, { time: '13', value: 70 }, { time: '14', value: 55 }
        //             ]
        //         },
        //         {
        //             id: 4,
        //             torqueGun: 2,
        //             position: 2,
        //             torqueValuePercent: 95,
        //             torqueAnglePercent: 97,
        //             totalReadings: 1300,
        //             inSpec: 1280,
        //             outOfSpec: 20,
        //             hasAlert: false,
        //             online: true,
        //             valueGraphData: [
        //                 { time: '06', value: 80 }, { time: '07', value: 85 }, { time: '08', value: 90 },
        //                 { time: '09', value: 95 }, { time: '10', value: 100 }, { time: '11', value: 105 },
        //                 { time: '12', value: 110 }, { time: '13', value: 115 }, { time: '14', value: 120 }
        //             ],
        //             angleGraphData: [
        //                 { time: '06', value: 85 }, { time: '07', value: 90 }, { time: '08', value: 95 },
        //                 { time: '09', value: 100 }, { time: '10', value: 105 }, { time: '11', value: 110 },
        //                 { time: '12', value: 115 }, { time: '13', value: 120 }, { time: '14', value: 110 }
        //             ]
        //         },
        //         {
        //             id: 5,
        //             torqueGun: 1,
        //             position: 3,
        //             torqueValuePercent: 68,
        //             torqueAnglePercent: 72,
        //             totalReadings: 900,
        //             inSpec: 850,
        //             outOfSpec: 50,
        //             hasAlert: true,
        //             online: false,
        //             valueGraphData: [
        //                 { time: '06', value: 20 }, { time: '07', value: 25 }, { time: '08', value: 30 },
        //                 { time: '09', value: 35 }, { time: '10', value: 40 }, { time: '11', value: 45 },
        //                 { time: '12', value: 50 }, { time: '13', value: 55 }, { time: '14', value: 60 }
        //             ],
        //             angleGraphData: [
        //                 { time: '06', value: 22 }, { time: '07', value: 28 }, { time: '08', value: 34 },
        //                 { time: '09', value: 40 }, { time: '10', value: 46 }, { time: '11', value: 52 },
        //                 { time: '12', value: 58 }, { time: '13', value: 64 }, { time: '14', value: 70 }
        //             ]
        //         },
        //         {
        //             id: 6,
        //             torqueGun: 2,
        //             position: 3,
        //             torqueValuePercent: 77,
        //             torqueAnglePercent: 85,
        //             totalReadings: 1100,
        //             inSpec: 1050,
        //             outOfSpec: 50,
        //             hasAlert: false,
        //             online: true,
        //             valueGraphData: [
        //                 { time: '06', value: 50 }, { time: '07', value: 55 }, { time: '08', value: 60 },
        //                 { time: '09', value: 65 }, { time: '10', value: 70 }, { time: '11', value: 75 },
        //                 { time: '12', value: 80 }, { time: '13', value: 85 }, { time: '14', value: 90 }
        //             ],
        //             angleGraphData: [
        //                 { time: '06', value: 55 }, { time: '07', value: 60 }, { time: '08', value: 65 },
        //                 { time: '09', value: 70 }, { time: '10', value: 75 }, { time: '11', value: 80 },
        //                 { time: '12', value: 85 }, { time: '13', value: 90 }, { time: '14', value: 95 }
        //             ]
        //         }
        //       ]);
        //     setLoading(false);
        // }, 1000);

        // // Uncomment and use this for real API:
        fetchData(); // Initial fetch

        const intervalId = setInterval(() => {
            fetchData();
        }, 50000); // API call every 2000ms (2 seconds)

        return () => clearInterval(intervalId); 
    }, []);
    const totalStations=onlineStations+offlineStations;

    // Dropdown handler
    const handleDropdown = (name) => setDropdown(dropdown === name ? "" : name);

    // Refresh handler
    const refreshData = () => {
        setLoading(true);
        fetchData();
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Filter Row */}
            <div className="flex flex-wrap gap-2 mb-4">
                {/* Line Dropdown */}
                <div className="relative">
                    <button
                        className="bg-white border rounded px-4 py-2 flex items-center shadow-sm hover:bg-gray-100 transition"
                        onClick={() => handleDropdown("line")}
                    >
                        {selectedLine}
                        <ChevronDown size={16} className="ml-2" />
                    </button>
                    {dropdown === "line" && (
                        <div className="absolute z-10 mt-1 w-40 bg-white border rounded shadow">
                            {lines.map(line => (
                                <div
                                    key={line}
                                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${selectedLine === line ? "bg-blue-100" : ""}`}
                                    onClick={() => { setSelectedLine(line); setDropdown(""); }}
                                >
                                    {line}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Station Dropdown */}
                <div className="relative">
                    <button
                        className="bg-white border rounded px-4 py-2 flex items-center shadow-sm hover:bg-gray-100 transition"
                        onClick={() => handleDropdown("station")}
                    >
                        {selectedStation}
                        <ChevronDown size={16} className="ml-2" />
                    </button>
                    {dropdown === "station" && (
                        <div className="absolute z-10 mt-1 w-40 bg-white border rounded shadow">
                            {stationsList.map(station => (
                                <div
                                    key={station}
                                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${selectedStation === station ? "bg-blue-100" : ""}`}
                                    onClick={() => { setSelectedStation(station); setDropdown(""); }}
                                >
                                    {station}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Torque Gun Dropdown */}
                <div className="relative">
                    <button
                        className="bg-white border rounded px-4 py-2 flex items-center shadow-sm hover:bg-gray-100 transition"
                        onClick={() => handleDropdown("gun")}
                    >
                        {selectedTorqueGun}
                        <ChevronDown size={16} className="ml-2" />
                    </button>
                    {dropdown === "gun" && (
                        <div className="absolute z-10 mt-1 w-40 bg-white border rounded shadow">
                            {torqueGuns.map(gun => (
                                <div
                                    key={gun}
                                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${selectedTorqueGun === gun ? "bg-blue-100" : ""}`}
                                    onClick={() => { setSelectedTorqueGun(gun); setDropdown(""); }}
                                >
                                    {gun}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Date Dropdown */}
                <div className="relative ml-auto">
                    <button
                        className="bg-white border rounded px-4 py-2 flex items-center shadow-sm hover:bg-gray-100 transition"
                        onClick={() => handleDropdown("date")}
                    >
                        {selectedDate}
                        <ChevronDown size={16} className="ml-2" />
                    </button>
                    {dropdown === "date" && (
                        <div className="absolute z-10 mt-1 w-40 bg-white border rounded shadow">
                            {dates.map(date => (
                                <div
                                    key={date}
                                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${selectedDate === date ? "bg-blue-100" : ""}`}
                                    onClick={() => { setSelectedDate(date); setDropdown(""); }}
                                >
                                    {date}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Refresh Button */}
                <button
                    className="ml-2 bg-blue-500 text-white rounded px-4 py-2 flex items-center shadow hover:bg-blue-600 transition"
                    onClick={refreshData}
                >
                    <RefreshCw size={16} className="mr-2" />
                    Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <SummaryCard
                    title="Total Stations"
                    value={totalStations}
                    icon={<LayoutGrid className="text-blue-500" size={28} />}
                    color="bg-blue-100"
                    percent="7.5"
                />
                <SummaryCard
                    title="Online Stations"
                    value={onlineStations}
                    icon={<Wifi className="text-green-500" size={28} />}
                    color="bg-green-100"
                    percent="7.5"
                />
                <SummaryCard
                    title="Offline Station"
                    value={offlineStations}
                    icon={<WifiOff className="text-yellow-500" size={28} />}
                    color="bg-yellow-100"
                    percent="7.5"
                />
                <SummaryCard
                    title="Alerts"
                    value={alerts}
                    icon={<AlertTriangle className="text-red-500" size={28} />}
                    color="bg-red-100"
                    percent="7.5"
                />
            </div>

            {/* Station Cards */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Loading stations data...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(stations).map((station, i) => (
                            
                        <StationCard key={i} data={latestData[station.station]} torque_gun={station.torque_gun} station={station} />
                    ))}
                </div>
            )}
        </div>
    );
}