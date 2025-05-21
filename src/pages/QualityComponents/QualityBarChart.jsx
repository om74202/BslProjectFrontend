import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';



const data = [
  
  {
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  }
  ,{
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  },{
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  },
  {
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  }
  ,{
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  },{
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  },
  {
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  },
  {
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  },
  {
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  },
  {
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  },
  {
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  },
  {
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  }
  ,
  {
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  },
  {
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  },
  {
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  },
  {
    name: 'Today',
    Rework: 15,   // Rework
    Rejection: 7     // Rejection
  }
  ,
];

export const QualityBarchart = () => {
  // Build chart data from two values
 

  return (
    <div className="w-full h-68">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
          
            bottom: 5,
          }}
          barCategoryGap={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
          
            dataKey="Rework"
            fill="#155dfc"
            radius={[10, 10, 0, 0]} // Rounded top corners
          />
          <Bar
            dataKey="Rejection"
            fill="#f59e42"
            radius={[10, 10, 0, 0]} // Rounded top corners
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
