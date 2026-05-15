"use client";
import { CartesianGrid, XAxis, Area, AreaChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Text } from "@/_components/shared/Text";
import { TrendingUp } from "lucide-react";

interface AnalyticsChartProps {
  data: {
    month: string;
    spam: number;
    phishing: number;
  }[];
  spamCount: string;
  phishingCount: string;
}

const chartConfig = {
  spam: {
    label: "Spam Detection",
    color: "var(--secondary-800)",
  },
  phishing: {
    label: "Phishing Attempts",
    color: "var(--error-500)",
  },
} satisfies ChartConfig;

export function AnalyticsChart({
  data,
  spamCount,
  phishingCount,
}: AnalyticsChartProps) {
  return (
    <div className="min-w-0 rounded-lg p-6 bg-background border border-primary-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <Text size={"lg"} font={"bold"}>
            Weekly Threat Distribution
          </Text>
        </div>
      </div>

      <div className="h-40 md:h-80 w-full min-w-0 overflow-hidden">
        <ChartContainer
          config={chartConfig}
          className="h-full w-full min-h-0 min-w-0"
        >
          <AreaChart
            data={data}
            margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillSpam" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.spam.color}
                  stopOpacity={0.1}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.spam.color}
                  stopOpacity={0.01}
                />
              </linearGradient>
              <linearGradient id="fillPhishing" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.phishing.color}
                  stopOpacity={0.1}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.phishing.color}
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              horizontal={true}
              strokeDasharray="4 4"
              stroke="#C8CFE8"
              opacity={0.4}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={15}
              interval={0}
              padding={{ left: 10, right: 10 }}
              tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 500 }}
            />
            <ChartTooltip
              cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }}
              content={<ChartTooltipContent indicator="dot" />}
            />

            <Area
              type="monotone"
              dataKey="spam"
              stroke={chartConfig.spam.color}
              strokeWidth={2}
              fill="url(#fillSpam)"
              dot={{
                r: 3,
                fill: "white",
                stroke: chartConfig.spam.color,
                strokeWidth: 2,
              }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="phishing"
              stroke={chartConfig.phishing.color}
              strokeWidth={2}
              fill="url(#fillPhishing)"
              dot={{
                r: 3,
                fill: "white",
                stroke: chartConfig.phishing.color,
                strokeWidth: 2,
              }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      <div className="mt-2 pt-4 border-t border-primary-100">
        <div className="flex flex-wrap items-center w-full md:max-w-md justify-between ">
          {/* Spam */}
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-secondary-800 shrink-0" />
            <div className="flex flex-col">
              <Text size="sm" font="medium" color="secondary-800">
                Spam Detection
              </Text>
              <Text size="sm" font="bold">
                {spamCount}{" "}
                <span className="font-semibold text-primary ml-1">blocked</span>
              </Text>
            </div>
          </div>

          {/* Phishing */}
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-error-500 shrink-0" />
            <div className="flex flex-col">
              <Text size="sm" font="medium" color="error-500">
                Phishing Attempts
              </Text>
              <Text size="sm" font="bold">
                {phishingCount}{" "}
                <span className="font-semibold text-primary ml-1">blocked</span>
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
