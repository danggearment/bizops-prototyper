import { GMProduct_SizeGuide } from "@/services/connect-rpc/types"
import { DataTable, useTable } from "@gearment/ui3"
import { sortSizes } from "@gearment/utils"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

interface TransformedSize {
  code: string
  value: string
}

interface TransformedProduct {
  productName: string
  sizes: TransformedSize[]
}

interface Props {
  product: GMProduct_SizeGuide
}

const columnHelper = createColumnHelper<TransformedProduct>()

export function TableProductSizeGuideline({ product }: Props) {
  const sizeGuidelines = useMemo(() => {
    return (
      product.sizeGuideContent[0]?.dimensions.map((v) => ({
        code: v.sizeCode,
        sizes: v.metrics.sort((a, b) => sortSizes(a.name, b.name)),
      })) || []
    )
  }, [product])

  const listSizeGuidelines = useMemo(() => {
    return sizeGuidelines
      .flatMap(({ code, sizes }) =>
        sizes.map(({ name, value }) => ({ name, code, value })),
      )
      .reduce((acc, { name, code, value }) => {
        const existingProduct = acc.find(
          (product) => product.productName === name,
        )
        if (existingProduct) {
          existingProduct.sizes.push({ code, value })
        } else {
          acc.push({ productName: name, sizes: [{ code, value }] })
        }
        return acc
      }, [] as TransformedProduct[])
  }, [sizeGuidelines])

  const sizeCodes: string[] = useMemo(() => {
    return Array.from(
      new Set(
        listSizeGuidelines.flatMap((item) =>
          item.sizes.map((size) => size.code),
        ),
      ),
    ).sort((a, b) => sortSizes(a, b))
  }, [listSizeGuidelines])

  const columns: ColumnDef<TransformedProduct, any>[] = useMemo(
    () => [
      columnHelper.accessor("productName", {
        header: () => <span>Product</span>,
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">{getValue()}</span>
        ),
      }),
      ...sizeCodes.map((sizeCode) =>
        columnHelper.accessor(
          (row) =>
            row.sizes.find((size) => size.code === sizeCode)?.value || "--",
          {
            id: sizeCode,
            header: () => <span>{sizeCode}</span>,
            cell: ({ getValue }) => (
              <span className="text-sm text-muted-foreground">
                {getValue()}
              </span>
            ),
          },
        ),
      ),
    ],
    [sizeCodes],
  )

  const table = useTable({
    columns,
    data: listSizeGuidelines,
  })
  return <DataTable table={table} />
}
