import { Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"

interface Props {
  children: React.ReactNode
}

export default function TooltipIOSSNumber({ children }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>

      <TooltipContent color="dark" side="top">
        <p className="w-[248px] py-[10px] body-small text-center whitespace-normal">
          Provide your IOSS number and the value of the order generated on your
          e-commerce platform to avoid additional tax charges on this order.{" "}
          <a
            className="text-primary"
            href="https://help.gearment.com/en-us/article/sales-tax-rtp0rj/#3-include-your-ioss-numbertax-number-in-your-order"
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
