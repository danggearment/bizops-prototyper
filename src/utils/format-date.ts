import { CreditIntervalUnit } from "@/services/connect-rpc/types"
import { Timestamp } from "@bufbuild/protobuf"
import { DateRangeDatePicker } from "@gearment/ui3"
import { addDays, addMonths, addYears, format } from "date-fns"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)

class Timezone {
  TIMEZONE = window.localStorage.getItem("timezone") || "America/Los_Angeles"
  setTimezone(timezone: string) {
    this.TIMEZONE = timezone
    window.localStorage.setItem("timezone", timezone)
  }
  getTimezone() {
    return this.TIMEZONE
  }
}
export const appTimezone = new Timezone()

export function formatDateString(
  date: string | Date | number,
  formatString = "YYYY/MM/DD HH:mm a",
) {
  if (dayjs(date).year() === 1) {
    return ""
  }
  return dayjs(date).tz(appTimezone.TIMEZONE).format(formatString)
}

export const formatDateRangeForSearching = (
  dateRange: DateRangeDatePicker | undefined,
) => {
  if (dateRange) {
    return {
      from: dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
      to: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    }
  }
  return {
    from: undefined,
    to: undefined,
  }
}

export function formatDateForCallApi(
  date: string | Date,
  formatFn?: "startOfDay" | "endOfDay",
): Timestamp
export function formatDateForCallApi(
  date: string | Date,
  isNormalizeTimezone: boolean,
): Timestamp
export function formatDateForCallApi(
  date: string | Date,
  arg: "startOfDay" | "endOfDay" | boolean = "startOfDay",
): Timestamp {
  if (typeof arg === "string" && (arg === "startOfDay" || arg === "endOfDay")) {
    let la = dayjs.tz(date, appTimezone.getTimezone())

    if (arg === "endOfDay") {
      la = dayjs.tz(date, appTimezone.getTimezone()).endOf("day")
    } else {
      la = dayjs.tz(date, appTimezone.getTimezone()).startOf("day")
    }

    const utcDate = la.utc()

    return new Timestamp({
      seconds: Math.trunc(
        utcDate.toDate().getTime() / 1000,
      ) as unknown as bigint,
    })
  } else if (typeof arg === "boolean") {
    const la = dayjs(date).utcOffset(0)
    return new Timestamp({
      seconds: Math.trunc(la.toDate().getTime() / 1000) as unknown as bigint,
    })
  }
  throw new Error("Invalid arguments passed to formatDateForCallApi")
}

export function calculateCreditDateWithOffset(
  startDate: Date,
  unit: CreditIntervalUnit,
  offset: number,
): Date {
  let targetDate = new Date(startDate)

  switch (unit) {
    case CreditIntervalUnit.DAY:
      targetDate = addDays(startDate, offset)
      break
    case CreditIntervalUnit.WEEK:
      targetDate = addDays(startDate, offset * 7)
      break
    case CreditIntervalUnit.MONTH:
      targetDate = addMonths(startDate, offset)
      break
    case CreditIntervalUnit.YEAR:
      targetDate = addYears(startDate, offset)
      break
    case CreditIntervalUnit.UNSPECIFIED:
    default:
      targetDate = startDate
      break
  }
  return targetDate
}

export function parseIntervalOption(optionValue: string): {
  offset: number
  unit: CreditIntervalUnit
} {
  try {
    return JSON.parse(optionValue)
  } catch {
    return { offset: 1, unit: CreditIntervalUnit.WEEK }
  }
}

export function calculateDateFromOption(
  startDate: Date,
  optionValue: string,
): Date {
  const { offset, unit } = parseIntervalOption(optionValue)
  return calculateCreditDateWithOffset(startDate, unit, offset)
}

export function startOfDayUTC(date: string | Date | number): Date {
  return dayjs(date).utc().startOf("day").toDate()
}

export function toUtcBoundaryTimestamp(
  value: string | Date | undefined,
  boundary: "start" | "end",
) {
  if (!value) return undefined
  const d =
    boundary === "start"
      ? dayjs.utc(value).startOf("day")
      : dayjs.utc(value).endOf("day")
  return new Timestamp({
    seconds: BigInt(Math.floor(d.valueOf() / 1000)),
  })
}
