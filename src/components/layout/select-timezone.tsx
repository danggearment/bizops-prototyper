import { appTimezone } from "@/utils/format-date"
import { Combobox } from "@gearment/ui3"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import Watcher from "./watcher"

// Hàm kiểm tra xem America/Los_Angeles hiện tại là UTC-7 (PDT) hay UTC-8 (PST)
function getLosAngelesUtcOffset() {
  // new Date() lấy thời gian hiện tại
  // Intl.DateTimeFormat trả về offset dạng "+07:00" hoặc "-08:00"
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    timeZoneName: "shortOffset",
  })
  const parts = dtf.formatToParts(new Date())
  const offsetPart = parts.find((p) => p.type === "timeZoneName")
  // offsetPart.value ví dụ: "GMT-7", "GMT-8"
  if (offsetPart && offsetPart.value) {
    if (offsetPart.value.includes("-7")) return -7
    if (offsetPart.value.includes("-8")) return -8
  }
  // fallback: dùng getTimezoneOffset (ít chính xác hơn)
  const now = new Date()
  // getTimezoneOffset trả về phút lệch so với UTC, ở LA là 420 (UTC-7) hoặc 480 (UTC-8)
  const offsetMinutes = now.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  })
  const laDate = new Date(offsetMinutes)
  const offset = laDate.getTimezoneOffset()
  if (offset === 420) return -7
  if (offset === 480) return -8
  return null
}

function getChicagoUtcOffset() {
  // new Date() lấy thời gian hiện tại
  // Intl.DateTimeFormat trả về offset dạng "+05:00" hoặc "-06:00"
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    timeZoneName: "shortOffset",
  })
  const parts = dtf.formatToParts(new Date())
  const offsetPart = parts.find((p) => p.type === "timeZoneName")
  // offsetPart.value ví dụ: "GMT-5", "GMT-6"
  if (offsetPart && offsetPart.value) {
    if (offsetPart.value.includes("-5")) return -5
    if (offsetPart.value.includes("-6")) return -6
  }
  // fallback: dùng getTimezoneOffset (ít chính xác hơn)
  const now = new Date()
  // getTimezoneOffset trả về phút lệch so với UTC, ở Chicago là 300 (UTC-5) hoặc 360 (UTC-6)
  const offsetMinutes = now.toLocaleString("en-US", {
    timeZone: "America/Chicago",
  })
  const chicagoDate = new Date(offsetMinutes)
  const offset = chicagoDate.getTimezoneOffset()
  if (offset === 300) return -5
  if (offset === 360) return -6
  return null
}

export const TIMEZONES = [
  {
    label: `🇺🇸 America/Los_Angeles (GMT${getLosAngelesUtcOffset()})`,
    value: "America/Los_Angeles",
  },
  {
    label: `🇺🇸 America/Chicago (GMT${getChicagoUtcOffset()})`,
    value: "America/Chicago",
  },
  {
    label: "🇻🇳 Asia/Ho_Chi_Minh (GMT+7)",
    value: "Asia/Ho_Chi_Minh",
  },
]

export default function SelectTimezone() {
  const { timezone, setTimezone } = useTimezone()
  return (
    <div className="flex items-center gap-2 px-1 border rounded-lg">
      <Watcher />
      <span className="text-border">|</span>
      <div className="[&_button]:border-0 [&_button]:shadow-none [&_button]:bg-transparent">
        <Combobox
          options={TIMEZONES}
          value={timezone}
          onChange={(value) => {
            if (value) {
              setTimezone(value)
            } else {
              setTimezone(appTimezone.getTimezone())
            }
          }}
          placeholder="Select timezone"
        />
      </div>
    </div>
  )
}

const TimeZoneContext = createContext<{
  timezone: string
  setTimezone: (timezone: string) => void
}>({
  timezone: appTimezone.getTimezone(),
  setTimezone: () => {},
})

export const useTimezone = () => {
  const context = useContext(TimeZoneContext)
  if (!context) {
    throw new Error("useTimezone must be used within a TimezoneProvider")
  }
  return context
}

export const TimezoneProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [timezone, setTimezone] = useState(appTimezone.getTimezone())
  const value = useMemo(
    () => ({ timezone, setTimezone }),
    [timezone, setTimezone],
  )

  useEffect(() => {
    if (timezone !== appTimezone.getTimezone()) {
      appTimezone.setTimezone(timezone)
      window.location.reload()
    }
  }, [timezone])

  return (
    <TimeZoneContext.Provider value={value}>
      {children}
    </TimeZoneContext.Provider>
  )
}
