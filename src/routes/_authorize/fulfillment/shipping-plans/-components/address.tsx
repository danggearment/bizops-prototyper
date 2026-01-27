import { normalizeAddress } from "@/utils/format-string"
import { GeneralAddress } from "@gearment/nextapi/common/type/v1/address_pb"

export default function Address({ address }: { address: GeneralAddress }) {
  const addressText = normalizeAddress(
    `${address.addressLine1}, 
    ${address.addressLine2}`,
  )

  const adminArea = normalizeAddress(
    `${address.adminArea2 || ""}, 
    ${address.adminArea1 || ""}`,
  )

  const postalCode = normalizeAddress(
    `${address.regionCode || ""}
    ${address.postalCode || ""},
    ${address.country || ""}`,
  )

  return (
    <div className="text-sm">
      <p>{addressText}</p>
      <p>{adminArea}</p>
      <p>{postalCode}</p>
    </div>
  )
}
