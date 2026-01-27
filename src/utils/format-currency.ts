import { Money } from "@gearment/nextapi/common/type/v1/money_pb"

export function formatCurrency(
  number: number,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat("en-US", {
    ...options,
    maximumFractionDigits: options?.maximumFractionDigits,
    style: "currency",
    currency: "USD",
  }).format(number)
}

export function formatPrice(price: Money | undefined) {
  if (!price) return ""
  const positiveNanos = Math.abs(price.nanos).toString().padStart(2, "0")
  return `${formatCurrency(Number(price.units), { maximumFractionDigits: 0 })}.${positiveNanos}`
}

export function getPrice(price: Money | undefined) {
  if (!price) return 0
  const units = Number(price.units)
  const nanos = Number(price.nanos)
  const sign = units < 0 || nanos < 0 ? -1 : 1
  return sign * Number(`${Math.abs(units)}.${Math.abs(nanos)}`)
}

export function getNumberFromInputMask(value: string) {
  if (value.includes("$")) return Number(value.substring(1).replace(/,/g, ""))
  return Number(value.replace(/,/g, ""))
}

export function getDecimalPart(number: number): number {
  const numberParsed = number.toString().split(".")[1]
  if (numberParsed) {
    if (numberParsed.length === 1) {
      return Number(numberParsed) * 10
    }
    return Number(numberParsed)
  }
  return 0
}

export function formatNumberToMoney(value: number | bigint): Money {
  return new Money({
    currencyCode: "USD",
    units: BigInt(parseInt(value.toString())),
    nanos: getDecimalPart(Number(value)),
  })
}
