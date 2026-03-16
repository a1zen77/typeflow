import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'

function WpmChart({ snapshots }) {
  if (!snapshots || snapshots.length === 0) {
    return (
      <div className="w-full h-32 flex items-center justify-center text-txt-untyped font-mono text-sm">
        not enough data to show graph
      </div>
    )
  }

  const data = snapshots.map((wpm, i) => ({
    second: `${(i + 1) * 5}s`,
    wpm,
  }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.04)"
          vertical={false}
        />
        <XAxis
          dataKey="second"
          tick={{ fill: '#5A5A7A', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#5A5A7A', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          domain={['auto', 'auto']}
        />
        <Tooltip
          contentStyle={{
            background: '#1C1C27',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            fontFamily: 'JetBrains Mono',
            fontSize: '12px',
            color: '#C8C8E0',
          }}
          itemStyle={{ color: '#7C6AF7' }}
          labelStyle={{ color: '#8888AA', marginBottom: '4px' }}
          formatter={(val) => [`${val} wpm`, '']}
          cursor={{ stroke: 'rgba(124,106,247,0.2)', strokeWidth: 1 }}
        />
        <Line
          type="monotone"
          dataKey="wpm"
          stroke="#7C6AF7"
          strokeWidth={2}
          dot={{ fill: '#7C6AF7', r: 3, strokeWidth: 0 }}
          activeDot={{ fill: '#7C6AF7', r: 5, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default WpmChart