
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BiometricPoint } from '../types';


interface IdentityRadarProps {
  data: BiometricPoint[];
}

export const IdentityRadar: React.FC<IdentityRadarProps> = ({ data }) => {
  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.05)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 'bold', letterSpacing: '0.1em' }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />

          <Radar
            name="Baremo Ideal"
            dataKey="ideal"
            stroke="#7B2CBF"
            strokeWidth={1}
            fill="#7B2CBF"
            fillOpacity={0.03}
            strokeDasharray="4 4"
          />

          <Radar
            name="Tu Identidad"
            dataKey="A"
            stroke="#00F3FF"
            strokeWidth={2}
            fill="#00F3FF"
            fillOpacity={0.15}
            animationDuration={2000}
          />

          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: '30px',
              fontSize: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              fontWeight: '900',
              opacity: 0.4
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
