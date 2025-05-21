import { Activity, Bolt, Waves, Zap } from "lucide-react";
import { useEffect, useState } from "react"
import LineChartDrive from "./LineChartDrive";

export const DriveCard=({drive={data:{amperage:{}}},data={voltage:"",frequency:""},currStatus='STOPPED'})=>{

   
    
    const latestData=data
    const amperageData=drive.data.amperage
    const voltage=latestData.voltage || 0
    const frequency=latestData.frequency || 0
    let ampere= latestData.amperage || 0
    const [isAlert , setIsAlert]= useState(currStatus==='RUNNING'?false:true);










    return (<div className="bg-white rounded-xl shadow-md p-6 flex flex-col w-full transition hover:shadow-lg">

        <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold truncate">
                    {drive.drive}
        </h2>

        <div className="flex items-center gap-2">
        {isAlert ? (
                        <span className="flex items-center text-orange-500 font-semibold bg-orange-100 px-3 py-1 rounded-lg text-xs">
                            <span className="mr-1 text-lg">●</span> Stopped
                        </span>
                    ) : (
                        <span className="flex items-center text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-lg text-xs">
                            <span className="mr-1 text-lg">●</span> Running
                        </span>
                    )}

        </div>


        </div>

        {/* Stats */}
        <div className="flex justify-between text-sm mb-3 border-t border-b border-gray-100 py-2">
                <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-lg">
                  <Zap size={24} /> 
                   <span>Current</span>
                 </div>
                    <div className="font-semibold text-gray-700 text-lg">{ampere} amp</div>
                </div>
                <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-lg">
                  <Bolt size={24} /> 
                   <span>Voltage</span>
                 </div>
                    <div className="font-semibold text-gray-700 text-lg">{voltage} volts</div>
                </div>
                <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-lg">
                  <Activity size={24} /> 
                   <span>Frequency</span>
                 </div>
                    <div className="font-semibold text-gray-700 text-lg">{frequency} hertz</div>
                </div>
            </div>

            <div className="flex flex-col w-full">
                <LineChartDrive
                                    data={amperageData}
                                />
            </div>


    </div>)
}