import { Button } from "@gearment/ui3"
import { createFileRoute, useParams, Link } from "@tanstack/react-router"
import { ArrowLeft, Maximize2 } from "lucide-react"
import { usePrototypeDetail } from "../-prototype-detail-context"

export const Route = createFileRoute(
  "/_authorize/prototyper/$prototypeId/preview/",
)({
  component: () => <Preview />,
  beforeLoad: () => ({
    breadcrumb: [
      { link: "/prototyper", name: "Prototypes" },
      { link: "/prototyper/$prototypeId", name: "Prototype Details" },
      { link: "#", name: "Preview" },
    ],
  }),
})

function Preview() {
  const params = useParams({
    from: "/_authorize/prototyper/$prototypeId/preview/",
  })
  const { prototype, loading } = usePrototypeDetail()

  if (loading || !prototype) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/prototyper/$prototypeId"
            params={{ prototypeId: params.prototypeId }}
          >
            <Button variant="outline" size="icon">
              <ArrowLeft size={14} />
            </Button>
          </Link>
          <div>
            <div className="font-medium">{prototype.moduleName}</div>
            <div className="text-sm text-muted-foreground">
              Full Screen Preview
            </div>
          </div>
        </div>
        <Button size="sm" variant="outline">
          <Maximize2 className="w-4 h-4 mr-2" />
          Open in New Tab
        </Button>
      </div>
      <div className="flex-1 bg-muted">
        <iframe
          srcDoc={prototype.previewHtml}
          className="w-full h-full bg-white"
          title="Prototype Full Preview"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  )
}
