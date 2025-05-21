import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceArea, Tooltip, ResponsiveContainer } from "recharts";

export default function LineChartWithBands({ data, type, onTypeChange ,min_limit , max_limit}) {

function sortByTime(data) {
  return data.sort((a, b) => a.time.localeCompare(b.time));
}


// console.log(sortedData)
const dataF=sortByTime(data)

    return (
        <div className="w-full h-48 mt-1 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataF}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[min_limit-10, max_limit+10]} />
                    <Tooltip />
                    <ReferenceArea y2={min_limit} fill="#fee2e2" fillOpacity={0.7} />
                    <ReferenceArea y1={min_limit} y2={max_limit} fill="#90EE90" fillOpacity={0.7} />
                    <ReferenceArea y2={max_limit+10} fill="#fee2e2" fillOpacity={0.7} />
                    <Line type="monotone" dataKey="value" stroke="#f59e42" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}



