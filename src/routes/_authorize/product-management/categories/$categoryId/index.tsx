import { CategoryDetailSearchSchema } from "@/schemas/schemas/categories"
import { Button, PageHeader } from "@gearment/ui3"
import {
  createFileRoute,
  Link,
  stripSearchParams,
  useRouterState,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import {
  ArrowLeftIcon,
  CircleCheckIcon,
  CircleXIcon,
  EditIcon,
} from "lucide-react"
import {
  CategoryDetailProvider,
  useCategoryDetail,
} from "./-category-detail-context"
import { CategoryInformation } from "./-components/category-information"
import { CategoryProducts } from "./-components/category-products"

export const Route = createFileRoute(
  "/_authorize/product-management/categories/$categoryId/",
)({
  beforeLoad: async ({ params: { categoryId } }) => {
    return {
      breadcrumb: [
        {
          name: "Product management",
          link: "/product-management",
        },
        {
          name: "Categories",
          link: "/product-management/categories",
        },
        {
          name: categoryId,
          link: "/product-management/categories/$categoryId",
        },
      ],
    }
  },
  validateSearch: zodValidator(CategoryDetailSearchSchema),
  search: {
    middlewares: [stripSearchParams(CategoryDetailSearchSchema.parse({}))],
  },
  component: () => (
    <CategoryDetailProvider>
      <Index />
    </CategoryDetailProvider>
  ),
})

function Index() {
  const { category } = useCategoryDetail()

  const callbackHistory = useRouterState({
    select: (state) => state.location.state,
  })

  return (
    <div className="space-y-4 mb-10">
      <Link
        to={callbackHistory.href || "/product-management/attributes/library"}
        className="inline-flex items-center gap-2"
      >
        <Button variant="outline" size="icon" className="p-0">
          <ArrowLeftIcon size={14} />
        </Button>
        <span>Back to categories</span>
      </Link>
      <PageHeader>
        <div>
          <PageHeader.Title>{category.categoryName}</PageHeader.Title>
          <PageHeader.Description>
            {category.description}
          </PageHeader.Description>
        </div>
        <PageHeader.Action>
          <Button className="w-[150px]" variant="outline" size="sm">
            <EditIcon size={14} /> Edit category
          </Button>
          {category.isActive ? (
            <Button variant="destructive" size="sm" className="w-[150px]">
              <CircleXIcon size={14} className="text-white" /> Disable category
            </Button>
          ) : (
            <Button size="sm" className="w-[150px]">
              <CircleCheckIcon size={14} className="text-white" /> Enable
              category
            </Button>
          )}
        </PageHeader.Action>
      </PageHeader>
      <CategoryInformation />
      <CategoryProducts />
    </div>
  )
}
