
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan',
    "Device 1": 4000,
    "Device 2": 2400,
    "Device 3": 2400,
  },
  {
    name: 'Feb',
    "Device 1": 3000,
    "Device 2": 1398,
    "Device 3": 2210,
  },
  {
    name: 'Mar',
    "Device 1": 2000,
    "Device 2": 9800,
    "Device 3": 2290,
  },
  {
    name: 'Apr',
    "Device 1": 2780,
    "Device 2": 3908,
    "Device 3": 2000,
  },
  {
    name: 'May',
    "Device 1": 1890,
    "Device 2": 4800,
    "Device 3": 2181,
  },
  {
    name: 'June',
    "Device 1": 2390,
    "Device 2": 3800,
    "Device 3": 2500,
  },
  {
    name: 'July',
    "Device 1": 3490,
    "Device 2": 4300,
    "Device 3": 2100,
  },
  {
    name: 'Aug',
    "Device 1": 3490,
    "Device 2": 4300,
    "Device 3": 2100,
  },
  {
    name: 'Sept',
    "Device 1": 3490,
    "Device 2": 4300,
    "Device 3": 2100,
  },
  {
    name: 'Oct',
    "Device 1": 3490,
    "Device 2": 4300,
    "Device 3": 2100,
  },
  {
    name: 'Nov',
    "Device 1": 3490,
    "Device 2": 4300,
    "Device 3": 2100,
  },
  {
    name: 'Dec',
    "Device 1": 3490,
    "Device 2": 4300,
    "Device 3": 2100,
  },
];

export default class Example extends PureComponent {

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Device 1" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Device 2" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Device 3" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
