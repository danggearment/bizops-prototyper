import { PageHeader, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Separator } from "@gearment/ui3"
import { createFileRoute, Link, useParams } from "@tanstack/react-router"
import { ArrowLeft, Clock, User, Code, Eye, FileText } from "lucide-react"
import { format } from "date-fns"
import { usePrototypeDetail } from "./-prototype-detail-context"
import PrototypeInfo from "./-components/prototype-info"
import GeneratedCode from "./-components/generated-code"
import PreviewIframe from "./-components/preview-iframe"
import CaseStudies from "./-components/case-studies"

export const Route = createFileRoute("/_authorize/prototyper/$prototypeId/")({  
  component: () => <Index />,
  beforeLoad: () => ({
    breadcrumb: [
      { link: "/prototyper", name: "Prototypes" },
      { link: "#", name: "Prototype Details" },
    ],
  }),
})

function Index() {
  const params = useParams({ from: "/_authorize/prototyper/$prototypeId/" })
  const { prototype, loading } = usePrototypeDetail()

  if (loading || !prototype) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <div className="body-small mb-4">
        <Link to="/prototyper" className="inline-flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ArrowLeft size={14} />
          </Button>
          Back to list
        </Link>
      </div>

      <PageHeader>
        <PageHeader.Title>
          <div className="flex flex-wrap items-center gap-3">
            <span className="heading-3 text-foreground">{prototype.moduleName}</span>
            <Badge variant={prototype.status === "completed" ? "default" : "secondary"}>
              {prototype.status}
            </Badge>
          </div>
        </PageHeader.Title>
        <PageHeader.Action>
          <Link to={`/prototyper/$prototypeId/preview`} params={{ prototypeId: params.prototypeId }}>
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
          </Link>
        </PageHeader.Action>
      </PageHeader>

      <div className="space-y-4">
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Created: {format(new Date(prototype.createdAt), "dd/MM/yyyy HH:mm")}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>By: {prototype.createdBy}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">
              <FileText className="w-4 h-4 mr-2" />
              Information
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="w-4 h-4 mr-2" />
              Generated Code
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="case-studies">
              <FileText className="w-4 h-4 mr-2" />
              Case Studies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <PrototypeInfo prototype={prototype} />
          </TabsContent>

          <TabsContent value="code">
            <GeneratedCode files={prototype.files} />
          </TabsContent>

          <TabsContent value="preview">
            <PreviewIframe html={prototype.previewHtml} />
          </TabsContent>

          <TabsContent value="case-studies">
            <CaseStudies prototypeId={params.prototypeId} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}