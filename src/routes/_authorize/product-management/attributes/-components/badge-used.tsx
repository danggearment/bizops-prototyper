export default function BadgeUsedInProducts({ count }: { count: number }) {
  const bgClass = count === 0 ? "bg-warning" : "bg-primary"
  const textClass =
    count === 0 ? "text-warning-foreground" : "text-primary-foreground"
  return (
    <span className={`py-1 px-4 rounded-full ${textClass} ${bgClass}`}>
      {count}
    </span>
  )
}
