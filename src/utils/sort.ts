export const sortSizes = (a: string, b: string) => {
  const sizes = [
    "XXXS",
    "XXXS/XXS",
    "XXS/XXXS",
    "XXS",
    "XXS/XS",
    "XS/XXS",
    "XS",
    "XS/S",
    "S/SX",
    "S",
    "S/M",
    "M/S",
    "M",
    "M/L",
    "L/M",
    "L",
    "XL/L",
    "L/XL",
    "XL",
    "XL/2XL",
    "2XL/XL",
    "2XL",
    "3XL/2XL",
    "2XL/3XL",
    "3XL",
    "4XL",
    "5XL",
  ]

  const aIdx = sizes.indexOf(a.toUpperCase())
  const bIdx = sizes.indexOf(b.toUpperCase())

  if (aIdx < 0) {
    return Number(a) - Number(b)
  }
  if (bIdx < 0) {
    return Number(a) - Number(b)
  }
  return aIdx - bIdx
}
