import { useState, useEffect, useCallback } from "react";
import { ChevronDown, RefreshCw, AlertTriangle, Wifi, WifiOff, LayoutGrid } from "lucide-react";
import SummaryCard from "./torqueComponents/SummaryCard";
import { DriveCard } from "./driveComponents/driveCard";
import { useAuth } from "../context/AuthContext";
import axios from "axios";


const lines = ["All Lines", "Line 1", "Line 2"];
const dummmyDrive = ["All Drive", "Drive 1", "Drive 2"];
export const DriveMonitoringPage=()=>{
    const {authUser}=useAuth();
    const [drives , setDrives]=useState([])
    const [totalDrives , setTotalDrives]=useState(0)
    const [onlineDrives , setOnlineDrives]=useState(0)
    const [OfflineDrives,setOfflineDrives]=useState(0)
    const [alert,setAlert]=useState(0)
    const [data,setData]=useState([])
    const [currData , setCurrData]=useState([])
    

    const [loading, setLoading] = useState(false);
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
                `${"http://20.198.22.6:3001/drive-status/data"
                }`,
                { headers }
            );

           
                const apiData =await  response.data.data;
                setDrives(apiData)
                setData(response.data.latestData2);
                setOnlineDrives(response.data.latestData.ALL.running_count);
                setOfflineDrives(response.data.latestData.ALL.stopped_count)
                setAlert(response.data.latestData.ALL.amp_fail_count)
                setCurrData(response.data.latestData)

   
           
        } catch (err) {
            console.error("Error fetching data:", err);
            
        }
    }, []);


    useEffect(() => {
       
        fetchData(); // Initial fetch

        const intervalId = setInterval(() => {
            fetchData();
        }, 50000); 

        return () => clearInterval(intervalId); 
    }, []);


    return <div className="p-6 bg-gray-50 min-h-screen">
    
    
    <div className="flex flex-wrap gap-2 mb-4">
                {/* Line Dropdown */}
                <div className="relative">
                    <button
                        className="bg-white border rounded px-4 py-2 flex items-center shadow-sm hover:bg-gray-100 transition"
                    >
                        All Lines
                        <ChevronDown size={16} className="ml-2" />
                    </button>
                    {/* {dropdown === "line" && (
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
                    )} */}
                </div>

                <div className="relative">
                    <button
                        className="bg-white border rounded px-4 py-2 flex items-center shadow-sm hover:bg-gray-100 transition"
                    >
                        All Drives
                        <ChevronDown size={16} className="ml-2" />
                    </button>
                    {/* {dropdown === "line" && (
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
                    )} */}
                </div>
                {/* Date Dropdown */}
                <div className="relative ml-auto" >
                    <button
                        className="bg-white border rounded px-4 py-2 flex items-center shadow-sm hover:bg-gray-100 transition"
                    >
                        Date
                        <ChevronDown size={16} className="ml-2" />
                    </button>
                    {/* {dropdown === "line" && (
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
                    )} */}
                </div>
               
                {/* Refresh Button */}
                <button
                    className="ml-2 bg-blue-500 text-white rounded px-4 py-2 flex items-center shadow hover:bg-blue-600 transition"
                   
                >
                    <RefreshCw size={16} className="mr-2" />
                    Refresh
                </button>
            </div>
            

            {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                            <SummaryCard
                                title="Total Drives"
                                value={totalDrives}
                                icon={<LayoutGrid className="text-blue-500" size={28} />}
                                color="bg-blue-100"
                                percent="7.5"
                            />
                            <SummaryCard
                                title="Online Drives"
                                value={onlineDrives}
                                icon={<Wifi className="text-green-500" size={28} />}
                                color="bg-green-100"
                                percent="7.5"
                            />
                            <SummaryCard
                                title="Offline Drives"
                                value={OfflineDrives}
                                icon={<WifiOff className="text-yellow-500" size={28} />}
                                color="bg-yellow-100"
                                percent="7.5"
                            />
                            <SummaryCard
                                title="Alerts"
                                value={alert}
                                icon={<AlertTriangle className="text-red-500" size={28} />}
                                color="bg-red-100"
                                percent="7.5"
                            />
                        </div>



                        {loading ? (
                                        <div className="flex justify-center items-center h-64">
                                            <p className="text-gray-500">Loading stations data...</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                               {drives.map((drive,i )=>{
                                                if(drive.drive!=="ALL"){
                                                    return <DriveCard key={i} drive={drive} data={data[drive.drive]}  currStatus={currData[drive.drive]?.status || 'STOPPED'}/>
                                                }
                                                return null;
                                               })}
                                        </div>
                                    )}
    </div>
}