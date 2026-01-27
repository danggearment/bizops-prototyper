import { DateTime } from "@/components/common/date-time"
import Image from "@/components/common/image/image"
import { NotFound } from "@/components/errors/not-found"
import { useQueryFinance } from "@/services/connect-rpc/transport"
import { formatDateString } from "@/utils"
import { staffGetInvoice } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import { Button, LoadingCircle, toast } from "@gearment/ui3"
import { createFileRoute, Link, useRouterState } from "@tanstack/react-router"
import { ArrowLeftIcon, PrinterIcon } from "lucide-react"
import React, { useCallback, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import Info from "./-component/info"
import InvoiceDetails from "./-component/invoice-detail"
import InvoiceItems from "./-component/invoice-item"

export const Route = createFileRoute(
  "/_authorize/finance/transactions/$transactionId/invoice/",
)({
  beforeLoad: () => ({
    breadcrumb: [
      {
        link: "/finance/transactions",
        name: "Transactions",
        search: undefined,
      },
      {
        link: "/finance/transactions/$transactionId",
        name: "Transaction detail",
        search: undefined,
      },
      {
        link: "#",
        name: "Invoice",
        search: undefined,
      },
    ],
  }),

  component: Index,
})

function Index() {
  const state = useRouterState({
    select: (state) => state.location.state,
  })
  const { transactionId } = Route.useParams()
  const [loading, setLoading] = useState(false)

  const { data, isPending, isError } = useQueryFinance(
    staffGetInvoice,
    { id: { value: transactionId, case: "txnId" } },
    { select: (data) => data.data },
  )

  const pdfRef = useRef<HTMLDivElement>(null)

  const reactToPrintFn = useReactToPrint({
    contentRef: pdfRef as React.RefObject<Element>,
    documentTitle:
      data?.invoiceInfo?.createdAt &&
      (data?.invoiceInfo?.id || data?.invoiceDetail?.txnId)
        ? `Invoice_${data?.invoiceInfo?.id || data?.invoiceDetail?.txnId}_${formatDateString(data?.invoiceInfo?.createdAt.toDate())}`
        : "Invoice detail",
    pageStyle: `
      @media print {
        @page {
          size: A4 landscape;
          margin: 16px 0;
        }
      }
      body {
        -webkit-print-color-adjust: exact;
      }
    `,
    onBeforePrint: async () => setLoading(true),
    onAfterPrint: () => {
      setLoading(false)
    },
    onPrintError: () => setLoading(false),
  })

  const handlePrintToPDF = useCallback(() => {
    try {
      reactToPrintFn()
    } catch (error) {
      toast({
        variant: "error",
        title: "Print invoice",
        description: "Unable to generate the invoice. Please try again later",
      })
    }
  }, [reactToPrintFn])

  if (isError) {
    return (
      <NotFound
        title="Invoice not found"
        description="The invoice you are looking for does not exist or has been moved. Please contact support for assistance."
      />
    )
  }

  return (
    <div className={"pb-8"}>
      <div className="mb-4 w-full flex justify-between">
        <Link
          to={state.href || "/finance/transactions/$transactionId"}
          className={"flex items-center gap-2  hover:text-secondary-foreground"}
        >
          <Button variant="outline" size="icon">
            <ArrowLeftIcon />
          </Button>
          <span>Back to detail</span>
        </Link>
        <Button
          onClick={handlePrintToPDF}
          disabled={loading}
          loading={loading}
          variant="outline"
        >
          <PrinterIcon />
          Print to PDF
        </Button>
      </div>

      {isPending && (
        <div className="flex justify-center items-center h-full">
          <LoadingCircle />
        </div>
      )}
      <div ref={pdfRef} className="bg-background rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {(data?.invoiceInfo?.id || data?.invoiceDetail?.txnId) &&
                `#${data?.invoiceInfo?.id || data?.invoiceDetail?.txnId}`}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <span>Created at:</span>
              {data?.invoiceInfo?.createdAt ? (
                <DateTime
                  date={data?.invoiceInfo?.createdAt.toDate()}
                  className="text-muted-foreground"
                />
              ) : (
                "--"
              )}
            </p>
          </div>
          <div>
            <Image
              url={"/gearment-store.svg"}
              width={200}
              height={60}
              responsive="h"
            />
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <div className="w-2/3 border rounded-md">
            <Info
              gearmentInfo={data?.gearmentInfo}
              invoiceInfo={data?.invoiceInfo}
            />
          </div>
          <div className="w-1/3 border rounded-md">
            <InvoiceDetails data={data?.invoiceDetail} />
          </div>
        </div>

        <InvoiceItems items={data?.invoiceItems || []} />
      </div>
    </div>
  )
}
