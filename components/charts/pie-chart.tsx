"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import React, { useEffect } from "react"
import axios from "axios"

interface TransactionData {
  transactionType: string;
  count: number;
}

const chartColors = [
  { transactionType: "REFUND", fill: "hsl(var(--chart-1))" },
  { transactionType: "DEPOSIT", fill: "hsl(var(--chart-2))" },
  { transactionType: "EXTERNAL_PAYMENT", fill: "hsl(var(--chart-3))" },
  { transactionType: "WITHDRAWAL", fill: "hsl(var(--chart-4))" },
  { transactionType: "TRANSFER", fill: "hsl(var(--chart-5))" },
  { transactionType: "OTHER", fill: "#4F9DCC" },
]


const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  REFUND: {
    label: "Refund",
    color: "hsl(var(--chart-1))",
  },
  DEPOSIT: {
    label: "Deposit",
    color: "hsl(var(--chart-2))",
  },
  EXTERNAL_PAYMENT: {
    label: "Ext Payment",
    color: "hsl(var(--chart-3))",
  },
  WITHDRAWAL: {
    label: "Withdrawal",
    color: "hsl(var(--chart-4))",
  },
  TRANSFER: {
    label: "Transfer",
    color: "hsl(var(--chart-5))",
  },
  OTHER: {
    label: "Other",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig

export default function PieChartComponent() {
  const [chartData, setChartData] = React.useState<TransactionData[]>([])

  // Add function to get date range string
  const getDateRangeString = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    const currentMonth = now.getMonth();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(currentMonth - 5);

    return `${months[sixMonthsAgo.getMonth()]} - ${months[currentMonth]} ${now.getFullYear()}`;
  }

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/report/transaction-type`, {
      withCredentials: true
    })
      .then(({ data: { success, message, data } }) => {
        setChartData(data?.report)
      })
      .catch(error => {
        console.error('Error fetching transaction type data:', error)
      })
  }, [])
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Transaction Type</CardTitle>
        <CardDescription>{getDateRangeString()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData.map(item => ({
                ...item,
                fill: chartColors.find(c => c.transactionType === item.transactionType)?.fill
              }))}
              dataKey="count"
              nameKey="transactionType"
              cx="50%"
              cy="50%"
            />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label || value}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter> */}
    </Card>
  )
}
