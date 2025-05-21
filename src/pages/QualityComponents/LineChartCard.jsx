import QualityLineChart from "./LineChart"

const dummyData = [
    { time: "09:00", value: 72 },
    { time: "10:00", value: 75 },
    { time: "11:00", value: 78 },
    { time: "12:00", value: 80 },
    { time: "13:00", value: 82 },
    { time: "14:00", value: 85 },
    { time: "15:00", value: 83 },
    { time: "16:00", value: 79 },
  ];
  
  const dummyPrevData = [
    { time: "09:00", value: 70 },
    { time: "10:00", value: 72 },
    { time: "11:00", value: 74 },
    { time: "12:00", value: 76 },
    { time: "13:00", value: 78 },
    { time: "14:00", value: 80 },
    { time: "15:00", value: 77 },
    { time: "16:00", value: 75 },
  ];
  
  const baseLine = 77;
  

export const LineChartCard=({name="name" ,percentageUp=7.5})=>{
    return (
        <div className="bg-white rounded-xl shadow-md p-6 ">
            <div className="font-bold text-3xl ml-4">
                {name}
            </div>

            <div>
                <QualityLineChart data={dummyData} prevData={dummyPrevData} baseLine={baseLine}/>
            </div>
            <div className="text-2xs text-green-500">{percentageUp}%<span className="text-gray-600"> from previous shift</span></div>
        </div>
    )
}