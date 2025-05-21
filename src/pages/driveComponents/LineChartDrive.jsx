import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceArea,Area, Tooltip, ResponsiveContainer } from "recharts";

export default function LineChartDrive({ data, type, onTypeChange }) {

    function sortByTimeAsc(data) {
        return data.sort((a, b) => {
          const t1 = new Date('1970-01-01T' + convertTo24Hour(a.time) + ':00');
          const t2 = new Date('1970-01-01T' + convertTo24Hour(b.time) + ':00');
          return t1 - t2;
        });
      }
      
      function convertTo24Hour(timeStr) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = String(parseInt(hours) + 12);
        return `${hours.padStart(2, '0')}:${minutes}`;
      }
      
      
      // console.log(sortedData)
      const dataF=sortByTimeAsc(data)

    return (
        <div className="w-full h-48 mt-1 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataF}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 1.5]} />
                    <Tooltip />
                    <Line type={"monotone"} dataKey="value" stroke="#f59e42" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}