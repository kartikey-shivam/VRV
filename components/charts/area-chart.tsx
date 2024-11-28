"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import axios from "axios"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TimeRangeUnit = 'days' | 'months' | 'year'

interface TimeRangeOption {
  amount: number
  unit: TimeRangeUnit
  placeholder: string
}

const timeRanges: TimeRangeOption[] = [
  { amount: 3, unit: 'months', placeholder: 'Last 3 months' },
  { amount: 30, unit: 'days', placeholder: 'Last 30 days' },
  { amount: 7, unit: 'days', placeholder: 'Last 7 days' },
  { amount: 1, unit: 'year', placeholder: 'Last 1 year' },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  amountSent: {
    label: "Amount Sent",
    color: "hsl(var(--chart-1))",
  },
  amountReceived: {
    label: "Amount Received",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function AreaChartComponent() {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<TimeRangeOption>(timeRanges[0])
  const [chartData, setChartData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchChartData = React.useCallback(async (timeRange: TimeRangeOption) => {
    setIsLoading(true)
    try {
      const { data: { success, message, data } } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/report/amounts?amount=${timeRange.amount}&unit=${timeRange.unit}`,
        { withCredentials: true }
      )
      setChartData(data?.report || [])
    } catch (error) {
      console.error('Error fetching chart data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchChartData(selectedTimeRange)
  }, [fetchChartData, selectedTimeRange])

  const handleTimeRangeChange = (value: string) => {
    const timeRange = timeRanges.find(range => `${range.amount}-${range.unit}` === value)
    if (timeRange) {
      setSelectedTimeRange(timeRange)
      fetchChartData(timeRange)
    }
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Amount Sent and Received
          </CardDescription>
        </div>
        <Select
          value={`${selectedTimeRange.amount}-${selectedTimeRange.unit}`}
          onValueChange={handleTimeRangeChange}
        >
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
            disabled={isLoading}
          >
            <SelectValue placeholder={selectedTimeRange.placeholder} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {timeRanges.map((range) => (
              <SelectItem
                key={`${range.amount}-${range.unit}`}
                value={`${range.amount}-${range.unit}`}
                className="rounded-lg"
              >
                {range.placeholder}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex h-[250px] items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center">
            <p>No transaction data available</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="amountReceived"
                type="natural"
                fill="url(#fillMobile)"
                stroke="var(--color-mobile)"
                stackId="a"
              />
              <Area
                dataKey="amountSent"
                type="natural"
                fill="url(#fillDesktop)"
                stroke="var(--color-desktop)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
