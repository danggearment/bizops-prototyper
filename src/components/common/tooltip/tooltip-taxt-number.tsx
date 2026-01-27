import { Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"

interface Props {
  children: React.ReactNode
}

export default function TooltipTaxNumber({ children }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent color="dark" side="top">
        <p className="w-[248px] py-[10px] body-small text-center whitespace-normal">
          A Tax Number is a unique identifier for businesses or individuals used
          by tax authorities to track tax obligations.{" "}
          <a
            className="text-primary"
            href="https://help.gearment.com/en-us/article/sales-tax-rtp0rj/"
            target="_blank"
            rel="noreferrer"
          >
            Click here
          </a>{" "}
          for more details.
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
