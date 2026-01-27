import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@gearment/ui3"
import { Link, useMatches } from "@tanstack/react-router"
import { Home } from "lucide-react"
import * as React from "react"

export interface Breadcrumb {
  name: string
  link: string
  search?: Record<string, string>
}

export default function AppBreadcrumb() {
  const matches = useMatches()
  const breadcrumbPromises = matches
    .map((match) => {
      const { staticData, context } = match
      if (staticData && staticData.breadcrumb) {
        return staticData.breadcrumb.map((b) => ({
          name: b.name,
          link: b.link,
          search: b.search,
        }))
      }
      if (context && context.breadcrumb) {
        return context.breadcrumb.map((b: any) => ({
          name: b.name,
          link: b.link,
        }))
      }
      return undefined
    })
    .filter(Boolean)
    .flat()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {(breadcrumbPromises || []).map((b, index) => {
          const latestBreadcrum = index === breadcrumbPromises.length - 1
          return (
            <React.Fragment key={`${b?.link}-${index}`}>
              <BreadcrumbLink className="flex items-center" asChild>
                <Link to={b?.link}>
                  {b?.link === "/" && (
                    <span className="pr-2">
                      <Home size={16} />
                    </span>
                  )}
                  {b?.name}
                </Link>
              </BreadcrumbLink>
              {!latestBreadcrum && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
