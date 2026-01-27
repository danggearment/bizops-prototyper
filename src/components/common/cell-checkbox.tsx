import { Checkbox } from "@gearment/ui3"
import { FormEvent } from "react"

interface Props extends React.ComponentProps<typeof Checkbox> {
  onChange: (e: FormEvent<HTMLButtonElement>) => void
}

export default function CellCheckbox({ ...props }: Props) {
  return (
    <div className="flex justify-center">
      <Checkbox
        {...props}
        onCheckedChange={(checked) => {
          const e = {
            target: {
              checked,
            },
          } as unknown as FormEvent<HTMLButtonElement>
          props.onChange?.(e)
        }}
      />
    </div>
  )
}
