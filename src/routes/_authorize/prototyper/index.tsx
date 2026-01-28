import { PageHeader, Tabs, TabsContent, TabsList, TabsTrigger } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { PrototyperSearchSchema } from "@/schemas/schemas/prototyper"
import PrototyperProvider from "./-prototyper-context"
import Filter from "./-components/filter/filter"
import Table from "./-components/table/table"
import CaseStudyList from "./-components/case-study/case-study-list"

export const Route = createFileRoute("/_authorize/prototyper/")({{
  validateSearch: zodValidator(PrototyperSearchSchema),
  search: {
    middlewares: [stripSearchParams(PrototyperSearchSchema.parse({}))],
  },
  component: () => (
    <PrototyperProvider>
      <Index />
    </PrototyperProvider>
  ),
  beforeLoad: () => ({
    breadcrumb: [{ link: "/prototyper", name: "Prototyper" }],
  }),
}})

function Index() {
  return (
    <>
      <PageHeader>
        <PageHeader.Title>Prototyper</PageHeader.Title>
      </PageHeader>
      <Tabs defaultValue="prototypes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="prototypes">Prototypes</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
        </TabsList>
        <TabsContent value="prototypes" className="space-y-4">
          <Filter />
          <Table />
        </TabsContent>
        <TabsContent value="case-studies">
          <CaseStudyList />
        </TabsContent>
      </Tabs>
    </>
  )
}