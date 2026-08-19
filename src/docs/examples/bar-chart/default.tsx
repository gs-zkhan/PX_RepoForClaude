import { BarChart } from "@/components/ui/bar-chart"

const data = [
  { month: "Apr", accounts: 42 },
  { month: "May", accounts: 58 },
  { month: "Jun", accounts: 51 },
  { month: "Jul", accounts: 67 },
]

export default function BarChartDefault() {
  return (
    <BarChart
      data={data}
      categoryKey="month"
      series={[{ key: "accounts", label: "Accounts", color: { series: 1 } }]}
    />
  )
}
