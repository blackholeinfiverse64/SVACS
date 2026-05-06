import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface Point {
  ts: string;
  label: string;
  signal: number;
  perception: number;
  intelligence: number;
  state: number;
}

const colors = {
  signal: "#22d3ee",
  perception: "#4ade80",
  intelligence: "#a78bfa",
  state: "#fbbf24",
};

export default function EventsOverTime({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="#1c2530" strokeDasharray="2 4" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="#5e6b76"
          tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
          axisLine={{ stroke: "#1c2530" }}
          tickLine={false}
        />
        <YAxis
          stroke="#5e6b76"
          tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
          axisLine={{ stroke: "#1c2530" }}
          tickLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: "#0b1014",
            border: "1px solid #1c2530",
            borderRadius: 6,
            fontSize: 11,
            fontFamily: "JetBrains Mono",
          }}
          labelStyle={{ color: "#9aa7b2" }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "#9aa7b2", paddingBottom: 4 }}
          iconType="circle"
          align="left"
          verticalAlign="top"
        />
        <Line
          type="monotone"
          dataKey="signal"
          name="Signal"
          stroke={colors.signal}
          strokeWidth={1.6}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="perception"
          name="Perception"
          stroke={colors.perception}
          strokeWidth={1.6}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="intelligence"
          name="Intelligence"
          stroke={colors.intelligence}
          strokeWidth={1.6}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="state"
          name="State"
          stroke={colors.state}
          strokeWidth={1.6}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
