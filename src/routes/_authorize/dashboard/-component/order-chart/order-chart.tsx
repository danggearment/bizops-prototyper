import FilterSalesOrderChart from "@/routes/_authorize/dashboard/-component/filter/filter-sales-order.tsx"
import { AreaChartType } from "@/schemas/schemas/area-chart.ts"
import { useQueryPod } from "@/services/connect-rpc/transport.tsx"
import { formatDateForCallApi } from "@/utils/format-date.ts"
import {
  staffGetStatisticSalesUnits,
  staffStatisticSalesOrder,
} from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery.ts"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import FilterSalesUnitChart from "../filter/filter-sales-unit"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@gearment/ui3"

const chartConfig = {
  count: {
    label: "Sales Orders",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const chartConfigBar = {
  count: {
    label: "Sales Units",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function OrderChart() {
  const search = useSearch({
    from: "/_authorize/dashboard/",
  })

  const [areaChartData, setAreaChartData] = useState<
    { date: string; count: number }[]
  >([])

  const navigate = useNavigate({
    from: "/dashboard",
  })

  const { data: areaData } = useQueryPod(
    staffStatisticSalesOrder,
    {
      from: search.from ? formatDateForCallApi(search.from) : undefined,
      to: search.to ? formatDateForCallApi(search.to, "endOfDay") : undefined,
    },
    {
      select: (data) => ({
        data: data.statistic,
      }),
    },
  )

  const { data: barData } = useQueryPod(
    staffGetStatisticSalesUnits,
    {
      from: search.fromSalesUnits
        ? formatDateForCallApi(search.fromSalesUnits)
        : undefined,
      to: search.toSalesUnits
        ? formatDateForCallApi(search.toSalesUnits, "endOfDay")
        : undefined,
    },
    {
      select: (data) => ({
        labels: data.statistic.map((item) => item.name),
        datasets: data.statistic.map((item) => ({
          date: item.name,
          count: item.totalQuantity,
        })),
      }),
    },
  )

  useEffect(() => {
    if (areaData?.data) {
      const transformedData = areaData.data.map((item) => ({
        date: item.date
          ? format(
              item.date.toDate
                ? item.date.toDate()
                : new Date(Number(item.date.seconds) * 1000),
              "MMM dd yyyy",
            )
          : "",
        count: item.count ?? 0,
      }))
      setAreaChartData(transformedData)
      console.log(transformedData)
    } else {
      setAreaChartData([])
    }
  }, [areaData])

  const handleChangeSearch = (search: AreaChartType) => {
    navigate({
      search: (old) => ({
        ...old,
        ...search,
      }),
      replace: true,
    })
  }

  return (
    <div className="mb-4">
      <div className="p-lg rounded-xl bg-background border p-4 mb-4">
        <h2 className="text-dark font-semibold text-lg mb-4 dark:text-white">
          Sales Orders
        </h2>
        <FilterSalesOrderChart handleChangeSearch={handleChangeSearch} />
        {/* <AreaChart data={areaChartData} /> */}
        <ChartContainer
          className="aspect-auto h-[250px] w-full"
          config={chartConfig}
        >
          <AreaChart
            accessibilityLayer
            data={areaChartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              dataKey="count"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <Area
              dataKey="count"
              type="linear"
              fillOpacity={0.4}
              fill="url(#fillCount)"
              dot={{
                fill: "var(--color-primary)",
              }}
              activeDot={{
                r: 4,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Area>
          </AreaChart>
        </ChartContainer>
      </div>

      <div className="p-lg rounded-xl bg-background border p-4">
        <h2 className="text-dark font-semibold text-lg mb-4 dark:text-white">
          Sales Units
        </h2>
        <FilterSalesUnitChart handleChangeSearch={handleChangeSearch} />
        <div>
          <ChartContainer
            config={chartConfigBar}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={barData?.datasets}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis
                dataKey="count"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-primary)" radius={2}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}
