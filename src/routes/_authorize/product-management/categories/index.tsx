import { CategorySchema } from "@/schemas/schemas/categories"
import { Button, PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { PlusIcon } from "lucide-react"
import { CategoryManagementProvider } from "./-category-management-context"
import { CategoryAnalytics } from "./-components/category-analytics"
import { CategoryMenu } from "./-components/category-menu"

export const Route = createFileRoute(
  "/_authorize/product-management/categories/",
)({
  staticData: {
    breadcrumb: [
      {
        name: "Product management",
        link: "/product-management",
      },
      {
        name: "Categories",
        link: "/product-management/categories",
      },
    ],
  },
  validateSearch: zodValidator(CategorySchema),
  search: {
    middlewares: [stripSearchParams(CategorySchema.parse({}))],
  },
  component: () => (
    <CategoryManagementProvider>
      <Index />
    </CategoryManagementProvider>
  ),
})

function Index() {
  return (
    <>
      <PageHeader>
        <div className="flex items-center justify-between space-y-2 w-full">
          <div>
            <PageHeader.Title>Categories management</PageHeader.Title>
            <PageHeader.Description>
              Organize categories and subcategories used across all products.
            </PageHeader.Description>
          </div>
          <div>
            <Button>
              <PlusIcon /> Add category
            </Button>
          </div>
        </div>
      </PageHeader>
      <div className="mb-4">
        <CategoryAnalytics />
      </div>
      <CategoryMenu />
    </>
  )
}
