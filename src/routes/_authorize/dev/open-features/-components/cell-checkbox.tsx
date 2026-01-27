import { Checkbox } from "@gearment/ui3"

interface Props extends React.ComponentProps<typeof Checkbox> {}

export default function CellCheckbox({ ...props }: Props) {
  return (
    <div className="flex justify-center">
      <Checkbox {...props} />
    </div>
  )
}
