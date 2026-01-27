import { File } from "@gearment/nextapi/common/type/v1/file_pb"
import { AllPositionOfClothes } from "@/constants/position-of-clothes"

export const handleDisablePrintingOptions = (
  printingOptions: {
    designFile?: File
    printLocationCode: string
  }[],
) => {
  const disabledPrintingOptions: Record<string, boolean> =
    printingOptions.reduce(
      (result: Record<string, boolean>, printingOption) => {
        if (
          printingOption.printLocationCode === AllPositionOfClothes.Front &&
          printingOption?.designFile?.fileUrl
        ) {
          result[AllPositionOfClothes.Pocket] = true
        }

        if (
          printingOption.printLocationCode === AllPositionOfClothes.Pocket &&
          printingOption?.designFile?.fileUrl
        ) {
          result[AllPositionOfClothes.Front] = true
        }
        return result
      },
      {},
    )
  return disabledPrintingOptions
}

export const checkPrintLocationRequired = (
  printingOptions: {
    designUrl: string
    printLocationCode: string
  }[],
) => {
  let enabledContinue = false
  let errorPrintLocation: Record<string, boolean> | undefined = undefined

  printingOptions.every((printingOption) => {
    if (
      (printingOption.printLocationCode === AllPositionOfClothes.Front ||
        printingOption.printLocationCode === AllPositionOfClothes.Back ||
        printingOption.printLocationCode === AllPositionOfClothes.Pocket) &&
      printingOption.designUrl
    ) {
      enabledContinue = true
      if (enabledContinue) {
        return false
      }
    }
    return true
  })

  if (!enabledContinue) {
    errorPrintLocation = {
      ...(errorPrintLocation || {}),
      [AllPositionOfClothes.Front]: true,
      [AllPositionOfClothes.Back]: true,
      [AllPositionOfClothes.Pocket]: true,
    }
  }
  return {
    enabledContinue,
    errorPrintLocation,
  }
}
