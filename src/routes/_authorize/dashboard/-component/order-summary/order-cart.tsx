import CountUp from "react-countup"

interface OrderCardProps {
  label: string
  count: number
}

export default function OrderCard({ label, count }: OrderCardProps) {
  return (
    <div className="flex-1 p-6 border rounded-xl bg-background">
      <div className="body-medium text-secondary-text">
        <span className="font-semibold text-secondary-foreground">{label}</span>
      </div>
      <div className="mt-2 heading-4 text-secondary-foreground">
        <CountUp end={count} duration={2} separator="," />
      </div>
    </div>
  )
}
