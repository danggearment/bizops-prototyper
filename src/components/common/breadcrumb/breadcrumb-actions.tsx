interface Props {
  children: React.ReactNode
}

export default function BreadcrumbActions({ children }: Props) {
  return (
    <div className="relative overflow-visible">
      <div className="2xl:absolute 2xl:-translate-y-full top-[-100%] right-0">
        {children}
      </div>
    </div>
  )
}
