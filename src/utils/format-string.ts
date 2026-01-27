export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function truncateWithEllipsis(s: string, length: number): string {
  if (s.length <= length) {
    return s
  }
  return s.slice(0, length) + "..."
}

export const normalizeAddress = (address: string) => {
  return address
    .split(",")
    .filter((item) => item.trim())
    .join(", ")
}

export const slugify = (text: string) => {
  text = text.replace(/^\s+|\s+$/g, "")
  text = text.toLowerCase()
  text = text
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
  return text
}
