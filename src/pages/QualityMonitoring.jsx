import { useState, useEffect, useCallback } from "react";
import { ChevronDown, RefreshCw, AlertTriangle, Wifi, WifiOff, LayoutGrid } from "lucide-react";
import SummaryCard from "./torqueComponents/SummaryCard";
import { DriveCard } from "./driveComponents/driveCard";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { SelectedButton } from "./QualityComponents/selectButton";
import { Piechart } from "./QualityComponents/Piechart";
import { PiechartCard } from "./QualityComponents/PiechartCard";
import QualityLineChart from "./QualityComponents/LineChart";
import { LineChartCard } from "./QualityComponents/LineChartCard";
import { QualityBarchart } from "./QualityComponents/QualityBarChart";
import { HorizontalBarChart } from "./QualityComponents/HorizontalBarchat";



const lines = ["All Lines", "Line 1","Line 2", "Line 3"]
const dates = ["Today", "Yesterday", "Last 7 Days"];
export const QualityMonitoringPage=()=>{

    const [dropdown, setDropdown] = useState("");
        const [selectedDate, setSelectedDate] = useState(dates[0]);

        // line selection 
        const [selectedLine , setSelectedLine]=useState(lines[0]);
        









        const handleDropdown = (name) => setDropdown(dropdown === name ? "" : name);
        const handleLineSelect=(name)=>{setSelectedLine(selectedLine===name ? "" : name)
            
        }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-wrap gap-2 mb-4">

            <div className="relative ml-auto" >
                    <button onClick={()=>handleDropdown("date")}
                        className="bg-white border rounded px-4 py-2 flex items-center shadow-sm hover:bg-gray-100 transition"
                    >
                        {selectedDate}
                        <ChevronDown size={16} className="ml-2" />
                    </button>
                    {dropdown === "date" && (
                        <div className="absolute z-10 mt-1 w-40 bg-white border rounded shadow">
                            {dates.map(date=> (
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
                   
                >
                    <RefreshCw size={16} className="mr-2" />
                    Refresh
                </button>
            </div>

            {/* Line Selection */}

            <div className="flex flex-wrap">
                {lines.map((line)=>(
                    <SelectedButton key={line} onClick={()=>{handleLineSelect(line)}} isClicked={selectedLine===line ? true :false}  text={line}/>
                ))}
            </div>

             {/* Summary Cards */}
                        <div className="grid grid-cols-1 mt-4 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                            <SummaryCard
                                title="Total Production"
                                value={"45"}
                                icon={<LayoutGrid className="text-blue-500" size={28} />}
                                color="bg-blue-100"
                                percent="7.5"
                            />
                            <SummaryCard
                                title="First time pass rate"
                                value={"23"}
                                icon={<Wifi className="text-green-500" size={28} />}
                                color="bg-green-100"
                                percent="7.5"
                            />
                            <SummaryCard
                                title="Rework Rate"
                                value={"20%"}
                                icon={<WifiOff className="text-yellow-500" size={28} />}
                                color="bg-yellow-100"
                                percent="7.5"
                            />
                            <SummaryCard
                                title="Reject Rate"
                                value={"2%"}
                                icon={<AlertTriangle className="text-red-500" size={28} />}
                                color="bg-red-100"
                                percent="7.5"
                            />
                        </div>

                        <div className="flex flex-row justify-between mt-4 grid grid-cols-3 w-full h-full"> 
                        <div className="mx-3">
                            <PiechartCard/>
                        </div>
                        <div className="mx-3">
                            <PiechartCard/>
                        </div>
                        <div className="mx-3">
                            <PiechartCard/>
                        </div>
                        </div>

                        <div className="mt-6">
                            <LineChartCard/>
                        </div>

                       <div>
                        <QualityBarchart />
                       </div>
                       
                        <div className="flex flex-row min-h-16">
                            <HorizontalBarChart/>
                            <HorizontalBarChart type="rejection"/>
                        </div>

                        <div className="mt-6">
                            <LineChartCard/>
                        </div>

                        <div className="mt-6">
                            <LineChartCard/>
                        </div>
        </div>
    )
}