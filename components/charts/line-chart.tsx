"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
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

const chartConfig = {
  views: {
    label: "Daily Transactions",
  },
  transactionCount: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig
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
export default function LineChartComponent() {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<TimeRangeOption>(timeRanges[0])
  const [chartData, setChartData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchChartData = React.useCallback(async (timeRange: TimeRangeOption) => {
    setIsLoading(true)
    try {
      const { data: { success, message, data } } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/report/number-of-transactions?amount=${timeRange.amount}&unit=${timeRange.unit}`,
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
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Daily Transactions</CardTitle>
          <CardDescription>
            Showing daily transactions
          </CardDescription>
        </div>
        <div className="px-6 py-5">
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
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
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
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
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
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                  />
                }
              />
              <Line
                dataKey="transactionCount"
                type="monotone"
                stroke={`var(--color-transactionCount)`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
