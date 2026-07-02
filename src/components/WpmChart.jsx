import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'

// Read current theme CSS variables directly from the document root
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function WpmChart({ snapshots }) {
  // Read theme colors at render time so they update when theme changes
  const brand        = getCSSVar('--brand')
  const bgSurface    = getCSSVar('--bg-surface')
  const bgCard       = getCSSVar('--bg-card')
  const txtUntyped   = getCSSVar('--txt-untyped')
  const txtSub       = getCSSVar('--txt-sub')
  const txtBase      = getCSSVar('--txt-base')

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
          stroke={txtUntyped}
          strokeOpacity={0.3}
          vertical={false}
        />
        <XAxis
          dataKey="second"
          tick={{ fill: txtSub, fontSize: 11, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: txtSub, fontSize: 11, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          domain={['auto', 'auto']}
        />
        <Tooltip
          contentStyle={{
            background: bgCard,
            border: `1px solid ${txtUntyped}`,
            borderRadius: '8px',
            fontFamily: 'JetBrains Mono',
            fontSize: '12px',
            color: txtBase,
          }}
          itemStyle={{ color: brand }}
          labelStyle={{ color: txtSub, marginBottom: '4px' }}
          formatter={(val) => [`${val} wpm`, '']}
          cursor={{ stroke: brand, strokeWidth: 1, strokeOpacity: 0.3 }}
        />
        <Line
          type="monotone"
          dataKey="wpm"
          stroke={brand}
          strokeWidth={2}
          dot={{ fill: brand, r: 3, strokeWidth: 0 }}
          activeDot={{ fill: brand, r: 5, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default WpmChart