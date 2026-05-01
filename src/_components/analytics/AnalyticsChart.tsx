"use client";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Text } from "@/_components/shared/Text";

interface AnalyticsChartProps {
  data: { month: string; spam: number; phishing: number }[];
  spamCount: string;
  phishingCount: string;
}

const chartConfig = {
  spam: {
    label: "Spam Detection",
    color: "#3b82f6",
  },
  phishing: {
    label: "Phishing Attempts",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export function AnalyticsChart({ data, spamCount, phishingCount }: AnalyticsChartProps) {
  return (
    <div className="min-w-0 border border-primary-100 rounded-xl p-6 max-h-[500px] h-full">
      <Text size={"lg"} font={"medium"} className="mb-2">
        Weekly Threat Distribution
      </Text>
      <div className="h-40 md:h-80 w-full min-w-0 overflow-hidden">
        <ChartContainer
          config={chartConfig}
          className="h-full w-full min-h-0 min-w-0 aspect-auto"
        >
          <LineChart data={data} margin={{ left: 12, right: 12, top: 20 }}>
            <CartesianGrid
              vertical={true}
              horizontal={false}
              strokeDasharray="3 3"
              stroke="#C8CFE8"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={15}
              tick={{ fill: "#4C4F59", fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />

            {/* Spam Line */}
            <Line
              type="monotone"
              dataKey="spam"
              stroke={chartConfig.spam.color}
              strokeWidth={2}
              dot={{ r: 4, fill: "white", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />

            {/* Phishing Line */}
            <Line
              type="monotone"
              dataKey="phishing"
              stroke={chartConfig.phishing.color}
              strokeWidth={2}
              dot={{ r: 4, fill: "white", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
      <hr className="bg-primary-100 mt-2 mb-4" />
      <div className="flex items-center justify-between max-w-full md:max-w-md w-full">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="w-4 h-4 rounded-full bg-secondary-800" />
          <div className="flex flex-col">
            <Text size="sm" font="medium" color="secondary-800">
              Spam Detection
            </Text>
            <Text size="sm" font="medium">
              {spamCount} blocked
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="w-4 h-4 rounded-full bg-error-500" />
          <div className="flex flex-col">
            <Text size="sm" color="error-500">
              Phishing Attempts
            </Text>
            <Text size="sm" font={"medium"}>
              {phishingCount} blocked
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
