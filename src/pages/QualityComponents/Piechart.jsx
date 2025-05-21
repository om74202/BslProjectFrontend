import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#155dfc','#60a5fa'];

export const Piechart = ({datat}) => {
  const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
  ];

  return (
    <div style={{ width: '100%', height: 300 }}> {/* Ensure height is set */}
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            labelLine={false}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
