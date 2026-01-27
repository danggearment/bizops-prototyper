import { formatDateString } from "@/utils"
import {
  Clock10Icon,
  Clock11Icon,
  Clock12Icon,
  Clock1Icon,
  Clock2Icon,
  Clock3Icon,
  Clock4Icon,
  Clock5Icon,
  Clock6Icon,
  Clock7Icon,
  Clock8Icon,
  Clock9Icon,
} from "lucide-react"
import { useEffect, useRef } from "react"

const clocks: React.ReactNode[] = [
  <Clock1Icon className="w-4 h-4" key={1} />,
  <Clock2Icon className="w-4 h-4" key={2} />,
  <Clock3Icon className="w-4 h-4" key={3} />,
  <Clock4Icon className="w-4 h-4" key={4} />,
  <Clock5Icon className="w-4 h-4" key={5} />,
  <Clock6Icon className="w-4 h-4" key={6} />,
  <Clock7Icon className="w-4 h-4" key={7} />,
  <Clock8Icon className="w-4 h-4" key={8} />,
  <Clock9Icon className="w-4 h-4" key={9} />,
  <Clock10Icon className="w-4 h-4" key={10} />,
  <Clock11Icon className="w-4 h-4" key={11} />,
  <Clock12Icon className="w-4 h-4" key={12} />,
]

export default function Watcher() {
  const refTimeString = useRef<HTMLSpanElement>(null)

  const getCurrrentTime = (formatString = "HH:mm:ss | DD/MM/YYYY") => {
    const currrentTime = new Date()
    return formatDateString(currrentTime, formatString)
  }

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (refTimeString.current) {
      timer = setInterval(() => {
        if (refTimeString.current) {
          refTimeString.current.innerHTML = getCurrrentTime()
        }
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [refTimeString.current])

  const renderClock = () => {
    function getClockHtml() {
      const currentHour = getCurrrentTime("h")
      return clocks[Number(currentHour) - 1]
    }
    let clockHtml: React.ReactNode = getClockHtml()
    setInterval(
      () => {
        clockHtml = getClockHtml()
      },
      1000 * 60 * 30,
    )
    return clockHtml
  }

  return (
    <div className="flex items-center gap-1">
      <div className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-secondary text-muted-foreground border border-accent">
        {renderClock()}
      </div>
      <span
        ref={refTimeString}
        className="tabular-nums text-sm font-semibold text-primary"
      >
        --:--:-- | --/--/----
      </span>
    </div>
  )
}
