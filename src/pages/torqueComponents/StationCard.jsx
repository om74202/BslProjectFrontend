import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import GaugeArc from "./GaugeChart";
import LineChartWithBands from "./LineGraph";

export default function StationCard({ station ,torque_gun, data}) {
    const [chartType, setChartType] = useState("Value");
    const [isAlert,setIsAlert]=useState(false);

    console.log(data[torque_gun])
    const dataf=data[torque_gun]


    const chartData = chartType === "Value" ? station.valueGraphData : station.angleGraphData;
    function getLatestEntry(dataArray) {
        if (!Array.isArray(dataArray) || dataArray.length === 0) return null;
        return dataArray[0];
      }



    const InspecTorquePercentage = dataf.pass_percentage
    const InspecAnglePercentage=dataf.angle_pass_percentage
    const InspecTorqueCount=dataf.pass_count
    const OutspecTorqueCount=dataf.fail_count
    const InspecAngleCount=dataf.angle_pass_count
    const OutspecAngleCount=dataf.angle_fail_count
    // console.log( latestInspecAnglePercentage , typeof latestInspecTorquePercentage , "Angle Values")
    const latestAlert=dataf.status
    useEffect(()=>{
        if(latestAlert==="fail"){
        setIsAlert(true)
    }else{
        setIsAlert(false);
    }
    },[latestAlert])
  









    return (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col w-full transition hover:shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold truncate">
                    {station.station} -  {torque_gun.replaceAll("_"," ")}
                </h2>
                <div className="flex items-center gap-2">
                    <div className="flex hidden items-center border border-gray-200 rounded-lg px-3 py-1 bg-gray-50 text-gray-700 text-sm font-medium">
                        <span>Position {}</span>
                        <ChevronDown size={16} className="ml-2" />
                    </div>
                    {isAlert ? (
                        <span className="flex items-center text-orange-600 font-semibold bg-orange-100 px-3 py-1 rounded-lg text-xs">
                            <span className="mr-1 text-lg">●</span> Alert
                        </span>
                    ) : (
                        <span className="flex items-center text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-lg text-xs">
                            <span className="mr-1 text-lg">●</span> Online
                        </span>
                    )}
                </div>
            </div>

            {/* Gauges */}
            <div className="flex flex-col sm:flex-row gap-3 mb-2">
                <div className="flex-1 flex flex-col items-center">
                    <GaugeArc value={InspecTorquePercentage} label="Torque Value In-Spec (%)" />
                </div>
                <div className="flex-1 flex flex-col items-center">
                    <GaugeArc value={InspecAnglePercentage} label="Torque Angle In-Spec (%)" />
                </div>
            </div>

            {/* Stats */}
            <div className="flex justify-between text-sm mb-3 border-t border-b border-gray-100 py-2">
                <div className="flex-1 text-center">
                    <div className="text-gray-500">Total Readings</div>
                    <div className="font-bold text-gray-800 text-lg">{chartType==="Value"? dataf.torque_count:dataf.angle_count}</div>
                </div>
                <div className="flex-1 text-center">
                    <div className="text-gray-500">In Spec</div>
                    <div className="font-bold text-blue-600 text-lg">{chartType==="Value"? InspecTorqueCount:InspecAngleCount}</div>
                </div>
                <div className="flex-1 text-center">
                    <div className="text-gray-500">Out Of Spec</div>
                    <div className="font-bold text-red-600 text-lg">{chartType==="Value"? OutspecTorqueCount:OutspecAngleCount}</div>
                </div>
            </div>

            {/* Toggle and Graph */}
            <div className="flex flex-col w-full">
                {/* Toggle Buttons */}
                <div className="flex justify-end ">
                    <div className="inline-flex rounded-md shadow-sm border border-gray-200 bg-gray-50">
                        <button
                            className={`px-4 py-1 text-sm font-medium rounded-l-md focus:outline-none transition ${chartType === "Value"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                }`}
                            onClick={() => setChartType("Value")}
                        >
                            Value
                        </button>
                        <button
                            className={`px-4 py-1 text-sm font-medium rounded-r-md focus:outline-none transition ${chartType === "Angle"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                }`}
                            onClick={() => setChartType("Angle")}
                        >
                            Angle
                        </button>
                    </div>
                </div>
                {/* Graph */}
                <LineChartWithBands
                    data={chartType==="Value"? station.data.torque_value:station.data.angle}
                    type={chartType}
                    min_limit={dataf.min_limit}
                    max_limit={dataf.max_limit}
                    onTypeChange={setChartType}
                    hideToggle={true} // Hide internal toggle if you have one in the chart component
                />
            </div>
        </div>
    );
}
