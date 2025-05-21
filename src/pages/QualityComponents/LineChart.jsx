import {
  ComposedChart,
  Line,
  XAxis,
  Area,
  YAxis,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function QualityLineChart({ data = [], prevData = [], baseLine }) {
  function sortByTime(data) {
    return data.sort((a, b) => a.time.localeCompare(b.time));
  }

  const sortedData = sortByTime([...data]);
  const sortedPrevData = sortByTime([...prevData]);

  const mergedData = sortedData.map((entry, index) => ({
    time: entry.time,
    value: entry.value,
    prevValue: sortedPrevData[index]?.value ?? null,
  }));

  return (
    <div className="w-full h-48 mt-1 -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip />
          <ReferenceArea y2={0} fill="#fee2e2" fillOpacity={0.7} />
          {baseLine !== undefined && (
            <ReferenceLine
              y={baseLine}
              stroke="#000000"
              strokeDasharray="5 5"
              label="Base Line"
            />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke="#155dfc"
            fill="#dae2f0"
            strokeWidth={2}
            dot={false}
            name="Current Data"
          />
          <Line
            type="monotone"
            dataKey="prevValue"
            stroke="#28bf5c"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
            name="Previous Data"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
