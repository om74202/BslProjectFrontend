import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList
  } from 'recharts';


  const data = [
    { name: 'January', value: 34 },
    { name: 'February', value: 45 },
    { name: 'March', value: 28 },
    { name: 'April', value: 52 },
    { name: 'May', value: 38 },
    { name: 'June', value: 47 },
    { name: 'July', value: 31 },
    { name: 'August', value: 59 },
    { name: 'September', value: 26 },
    { name: 'October', value: 49 },
    { name: 'November', value: 41 },
    { name: 'December', value: 33 },
    { name: 'January', value: 34 },
    { name: 'February', value: 45 },
    { name: 'March', value: 28 },
    { name: 'April', value: 52 },
  
  ];
  
  
  export const HorizontalBarChart = ({type="rework"}) => {
   
  
    return (
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Bar
            dataKey="value"
            fill={`${type==="rework" ? `#155dfc`:`#f59e42`}`}
            radius={[10, 10, 10, 10]} // Rounded corners
          >
            <LabelList dataKey="value" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };
  