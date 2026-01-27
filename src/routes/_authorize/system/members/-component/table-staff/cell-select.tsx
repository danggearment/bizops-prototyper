import { useAuth } from "@/services/auth"
import { Checkbox } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"
interface Props
  extends CellContext<any, any>,
    React.ComponentProps<typeof Checkbox> {}

export default function CellSelect({ ...props }: Props) {
  const { user } = useAuth()
  return (
    <div className="flex justify-center">
      <Checkbox
        {...props}
        disabled={
          props.disabled || user?.staffId === props.row.original.staffId
        }
      />
    </div>
  )
}
