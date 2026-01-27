import { Link, useLocation } from "@tanstack/react-router"
import { useMemo } from "react"
import { usePriceTier } from "./price-tier/price-tier-context"

export function TierAnalytics() {
  const { countTeamPriceTier, priceTierKeys } = usePriceTier()
  const location = useLocation()

  const totalTeams = useMemo(() => {
    return countTeamPriceTier.reduce((acc, { count }) => acc + Number(count), 0)
  }, [countTeamPriceTier])

  const countTeamPriceTierMap = useMemo(
    () =>
      countTeamPriceTier.reduce<Record<string, number>>(
        (map, { tierId, count }) => {
          map[tierId] = Number(count) || 0
          return map
        },
        {},
      ),
    [countTeamPriceTier],
  )

  const analytics = useMemo(
    () =>
      priceTierKeys.map((tier) => ({
        ...tier,
        value: countTeamPriceTierMap[tier.tierId] ?? 0,
      })),
    [priceTierKeys, countTeamPriceTierMap],
  )

  return (
    <div className="bg-background rounded-md p-4 mb-4">
      <div className="text-lg font-semibold">Team distribution by tier</div>
      <p className="text-sm text-foreground/50 mb-4">
        Overview of {totalTeams} teams across all tiers
      </p>
      <div
        className="grid grid-cols-1 gap-4 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
        style={
          {
            "--cols": analytics.length,
          } as React.CSSProperties
        }
      >
        {analytics.map((item) => (
          <Link
            to="/system/teams"
            search={{
              tierIds: [item.tierId],
            }}
            state={location}
            key={item.tierId}
            className="hover:bg-sidebar-accent rounded-lg flex flex-col text-left p-4 border border-l-4"
            style={{
              color: item.color,
              borderLeftColor: item.color,
            }}
          >
            <span className="text-2xl font-bold text-foreground">
              {item.value}{" "}
              <span className="text-sm font-semibold text-foreground/50">
                teams
              </span>
            </span>
            <span
              className="text-md font-semibold text-foreground/50"
              style={{ color: item.color }}
            >
              {item.tierName} tier
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
