interface Props {
  label: string
  value: React.ReactNode
}

export default function RowItem({ label, value }: Props) {
  return (
    <div className="mb-4">
      <p className="text-gray-500 mb-1">{label}</p>
      <p>{value || "--"}</p>
    </div>
  )
}
